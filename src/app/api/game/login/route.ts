import { db } from "@/db";
import { hairs, items, users, users_characters, users_characters_items } from "@/db/schema";
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
}

async function GetCharEquipItemById(itemId: number) : Promise<any | null> {
    const _items = await db.query.items.findFirst({
      columns: { id: true, Equipment: true, File: true, Link: true, Type: true },
      where: eq(items.id, itemId)
    });

    if (!_items) return null;
    if (_items.Equipment === "pe") return {};

    const itemData : any = {
      ItemID: _items.id,
      sFile: _items.File,
      sLink: _items.Link,
    }

    if (_items.Equipment === "Weapon") {
      itemData["sType"] = _items.Type;
    }

    return {
      "equipment": _items.Equipment,
      "item": itemData
    };
}

async function GetCharEquipments(charId : number) : Promise<any> {
    const equipments: any = {};

    const charItems = await db.query.users_characters_items.findMany({
      columns: { ItemID: true },
      where: eq(users_characters_items.CharID, charId)
    });

    for (const charItem of charItems) {
      const item = await GetCharEquipItemById(charItem.ItemID);
      if (item && item.equipment) {
        equipments[item.equipment] = item.item;
      }
    }

    return equipments;
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return Response.json({ sMsg: "Error!", bSuccess: 0 }, { status: 400 });
  }
  
  const text = await req.text();

  let data : any = Object.fromEntries(new URLSearchParams(text));

  if (!data.user || !data.pass) {
    return Response.json({ sMsg: "Invalid!", bSuccess: 0 });
  }

  try {
    const user = await db.query.users.findFirst({
      columns: { id: true, Name: true, Password: true, Email: true, CharacterSlot: true },
      where: eq(users.Name, data.user),
    });

    if (!user || !(await bcrypt.compare(data.pass, user.Password))) {
      return Response.json({ sMsg: "The username you typed was not found. Please check your spelling and try again.", bSuccess: 0 });
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
            intMaxCharSlot: 6
        },
        characters: []
    };

    const characters = await db.query.users_characters.findMany({
      columns: { id: true, Name: true, Gender: true, HairID: true, Level: true, ColorSkin: true, ColorHair: true, ColorBase: true, ColorEye: true, ColorTrim: true, ColorAccessory: true },
      where: eq(users_characters.UserID, user.id)
    });

    if (characters) {
      for (const character of characters) {

        const [_guild] = await db.execute(`SELECT b.Name, b.Color FROM users_characters_guilds AS a INNER JOIN guilds as b ON a.GuildID = b.id WHERE a.CharID = ${character.id} LIMIT 1`) as any;
        const [_class] = await db.execute(`SELECT a.Quantity AS Rank, b.Name FROM users_characters_items as a INNER JOIN items as b ON a.ItemID = b.id WHERE b.Equipment = 'ar' AND b.Type = 'Class' AND a.CharID = ${character.id} LIMIT 1`) as any;
        const _hair = await db.query.hairs.findFirst({ where: eq(hairs.id, character.HairID)});
        const equipments = await GetCharEquipments(character.id);

        payload.characters.push({
          charId: character.id,
          strGender: character.Gender,
          strUsername: character.Name,
          strHairName: _hair?.Name || "",
          strHairFilename: _hair?.File || "",
          strClassName: _class?.Name || "",
          intClassRank: _class?.Rank || 0,
          intLevel: character.Level,
          intColorSkin: parseInt(character.ColorSkin, 16),
          intColorHair: parseInt(character.ColorHair, 16),
          intColorBase: parseInt(character.ColorBase, 16),
          intColorEye: parseInt(character.ColorEye, 16),
          intColorTrim: parseInt(character.ColorTrim, 16),
          intColorAccessory: parseInt(character.ColorAccessory, 16),
          guild: _guild ? { strName: _guild.Name, strColor: _guild.Color } : null,
          eqp: equipments
        });
      }
    }

    console.log(JSON.stringify(payload));

    return Response.json(payload);
    
  } catch(error) {
    console.error(error);
    return Response.json({ sMsg: "Error login!", bSuccess: 0 });
  }
}
