import { get } from "http";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  guilds,
  users_characters_guilds as char_guilds,
  items,
  users_characters_items as char_items,
  users,
  users_characters,
} from "@/db/schema";
import { decToHex } from "@/lib/hex";

export type CreateType = {
  userId: number;
  name: string;
  gender: "M" | "F";
  hairId: number;
  color: ColorType;
  items: string;
};

export type ColorType = {
  hair: string;
  skin: string;
  eye: string;
  base: string;
  trim: string;
  accessory: string;
};

export type CharEquipType = {
  equipment: string;
  item: {
    ItemID: number;
    sFile: string;
    sLink: string;
    sType?: string;
  };
};

export async function checkChar(charId: number): Promise<boolean> {
  const char = await db.query.users_characters.findFirst({
    columns: { id: true },
    where: eq(users_characters.id, charId),
  });
  return !!char;
}

export async function isExistCharName(name: string): Promise<boolean> {
  const char = await db.query.users_characters.findFirst({
    columns: { id: true },
    where: eq(users_characters.Name, name),
  });
  return !!char;
}

export async function getCharGuildByCharId(
  charId: number
): Promise<{ Name: string; Color: string } | null> {
  const [guild] = await db
    .select({
      Name: guilds.Name,
      Color: guilds.Color,
    })
    .from(char_guilds)
    .innerJoin(guilds, eq(char_guilds.GuildID, guilds.id))
    .where(eq(char_guilds.CharID, charId))
    .limit(1);

  return guild || null;
}

export async function getCharClass(
  charId: number
): Promise<{ Rank: number; Name: string } | null> {
  const [charClass] = await db
    .select({
      Rank: items.Quantity,
      Name: items.Name,
    })
    .from(char_items)
    .innerJoin(items, eq(char_items.ItemID, items.id))
    .where(
      and(
        eq(char_items.CharID, charId),
        eq(items.Equipment, "ar"),
        eq(items.Type, "Class")
      )
    )
    .limit(1);

  return charClass || null;
}

export async function getCharEquipments(
  charId: number
): Promise<Record<string, CharEquipType["item"]>> {
  const equipments: Record<string, CharEquipType["item"]> = {};

  const charItems = await db.query.users_characters_items.findMany({
    columns: { ItemID: true },
    where: and(eq(char_items.CharID, charId), eq(char_items.Equipped, true)),
  });

  for (const charItem of charItems) {
    const item = await getCharEquipItemById(charItem.ItemID);
    if (item && item.equipment) {
      equipments[item.equipment] = item.item;
    }
  }

  return equipments;
}

export async function getCharEquipItemById(
  itemId: number
): Promise<CharEquipType | null> {
  const _items = await db.query.items.findFirst({
    columns: { id: true, Equipment: true, File: true, Link: true, Type: true },
    where: eq(items.id, itemId),
  });

  if (!_items) return null;
  if (_items.Equipment === "pe") return null;

  const itemData: CharEquipType["item"] = {
    ItemID: _items.id,
    sFile: _items.File ?? "",
    sLink: _items.Link ?? "",
  };

  if (_items.Equipment === "Weapon") {
    itemData["sType"] = _items.Type;
  }

  return {
    equipment: _items.Equipment,
    item: itemData,
  };
}

export async function getUserCharAuthByWhere(where: any): Promise<{
  id: number;
  Name: string;
  Access: number;
  Email: string;
  Password: string;
  DiscordID: bigint | null;
  DiscordAvatar: string | null;
} | null> {
  if (!where) return null;

  var [character] = await db
    .select({
      id: users_characters.id,
      Name: users_characters.Name,
      Access: users_characters.Access,
      Email: users.Email,
      Password: users.Password,
      DiscordID: users.DiscordID,
      DiscordAvatar: users.DiscordAvatar,
    })
    .from(users_characters)
    .innerJoin(users, eq(users_characters.UserID, users.id))
    .where(where)
    .limit(1);

  return character || null;
}

export async function createChar(data: CreateType) {

  console.log(`Creating character ${JSON.stringify(data)}`);

  return await db.transaction(async (tx) => {
    
    await tx.insert(users_characters).values({
      UserID: data.userId,
      Name: data.name,
      Gender: data.gender,
      ColorHair: decToHex(Number(data.color.hair)),
      ColorSkin: decToHex(Number(data.color.skin)),
      ColorEye: decToHex(Number(data.color.eye)),
      ColorBase: decToHex(Number(data.color.base)),
      ColorTrim: decToHex(Number(data.color.trim)),
      ColorAccessory: decToHex(Number(data.color.accessory)),
      HairID: data.hairId,
      Age: 18,
    });

    const userChar = await tx.query.users_characters.findFirst({
      columns: { id: true },
      where: and(
        eq(users_characters.UserID, data.userId),
        eq(users_characters.Name, data.name)
      ),
    });

    if (!userChar) throw new Error("Character creation failed");

    const itemsArray = (Array.isArray(data.items) ? data.items : data.items.split(","))
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    await tx.insert(char_items).values([
      {
        CharID: userChar.id,
        ItemID: itemsArray[0],
        EnhID: 1,
        Equipped: true,
      },
      {
        CharID: userChar.id,
        ItemID: itemsArray[1],
        EnhID: 1,
        Equipped: true,
      },
    ]);
  });
}

export async function getPasswordHashByCharId(charId: number): Promise<string | null> {
  const [char] = await db
    .select({ Password: users.Password })
    .from(users_characters)
    .leftJoin(users, eq(users_characters.UserID, users.id))
    .where(eq(users_characters.id, charId))
    .limit(1);

  return char?.Password ?? null;
}

export async function deleteChar(charId: number) {
  return await db.transaction(async (tx) => {
    await tx.delete(users_characters).where(eq(users_characters.id, charId));
  });
}