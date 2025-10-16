import { db } from "@/db";
import {
  users,
  users_characters,
} from "@/db/schema";
import { getCharGuildByCharId, getCharEquipments, getCharClass } from "@/features/characters/characters";
import { getHairById } from "@/features/hairs/hairs";
import { hexToDec } from "@/lib/hex";
import { parseFlashUrlencoded } from "@/lib/parse";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

type Payload = {
  bSuccess: number;
  login: {
    userId: number;
    sMsg: string;
    sToken: string;
    strEmail: string;
    unm: string;
    intCharSlot: number;
    intMaxCharSlot: number;
  };
  characters: any[];
};

type CharacterObj = {
  charId: number;
  strGender: string;
  strUsername: string;
  strHairName: string;
  strHairFilename: string;
  strClassName: any;
  intClassRank: any;
  intLevel: number;
  intColorSkin: number;
  intColorHair: number;
  intColorBase: number;
  intColorEye: number;
  intColorTrim: number;
  intColorAccessory: number;
  eqp: any;
  guild?: { Name: string; Color: string };
};

export async function POST(req: Request) {
  let data: any = await parseFlashUrlencoded(req);

  if (!data || !data.user || !data.pass) {
    return Response.json({ sMsg: "Invalid!", bSuccess: 0 });
  }

  try {
    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        Name: true,
        Password: true,
        Email: true,
        CharacterSlot: true,
      },
      where: eq(users.Name, data.user),
    });

    if (!user || !(await bcrypt.compare(data.pass, user.Password))) {
      return Response.json({
        sMsg: "The username you typed was not found. Please check your spelling and try again.",
        bSuccess: 0,
      });
    }

    const payload: Payload = {
      bSuccess: 1,
      login: {
        userId: user.id,
        sMsg: "success",
        sToken: user.Password,
        strEmail: user.Email,
        unm: user.Name,
        intCharSlot: user.CharacterSlot,
        intMaxCharSlot: 6,
      },
      characters: [],
    };

    const characters = await db.query.users_characters.findMany({
      columns: {
        id: true,
        Name: true,
        Gender: true,
        HairID: true,
        Level: true,
        ColorSkin: true,
        ColorHair: true,
        ColorBase: true,
        ColorEye: true,
        ColorTrim: true,
        ColorAccessory: true,
      },
      where: eq(users_characters.UserID, user.id),
    });

    if (characters) {
      for (const character of characters) {
        const charClass = await getCharClass(character.id);
        const hair = await getHairById(character.HairID);
        const equipments = await getCharEquipments(character.id);

        var characterObj: CharacterObj = {
          charId: character.id,
          strGender: character.Gender,
          strUsername: character.Name,
          strHairName: hair?.Name || "",
          strHairFilename: hair?.File || "",
          strClassName: charClass?.Name || "",
          intClassRank: charClass?.Rank || 0,
          intLevel: character.Level,
          intColorSkin: hexToDec(character.ColorSkin),
          intColorHair: hexToDec(character.ColorHair),
          intColorBase: hexToDec(character.ColorBase),
          intColorEye: hexToDec(character.ColorEye),
          intColorTrim: hexToDec(character.ColorTrim),
          intColorAccessory: hexToDec(character.ColorAccessory),
          eqp: equipments,
        };

        var guild = await getCharGuildByCharId(character.id);
        if (guild) characterObj.guild = guild;

        payload.characters.push(characterObj);
      }
    }

    return Response.json(payload);
  } catch (error) {
    console.error(error);
    return Response.json({ sMsg: "Error login!", bSuccess: 0 });
  }
}
