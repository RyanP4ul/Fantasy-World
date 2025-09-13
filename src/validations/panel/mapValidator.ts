import z from "zod";

export const mapsSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int(),
  Name: z.string().trim().regex(/^[A-Za-z0-9_ ]+$/, "Only letters and numbers are allowed").max(32),
  File: z.string().trim().regex(/^[A-Za-z0-9_ ]+\.swf$/i, {message: "Filename must be alphanumeric and end with .swf"}),
  MaxPlayers: z.int().min(1).max(100),
  ReqLevel: z.int().min(1).max(100),
  ReqParty: z.boolean().optional(),
  Upgrade: z.boolean().optional(),
  Staff: z.boolean().optional(),
  PvP: z.boolean().optional(),
  WorldBoss: z.boolean().optional(),
  Timeline: z.boolean().optional(),
});

export const mapItemSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  MapID: z.int().nonnegative(),
  ItemID: z.int().nonnegative()
});

export const mapMonsterSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  MapID: z.int().nonnegative(),
  MonsterID: z.int().nonnegative(),
  MonMapID: z.int().nonnegative(),
  Frame: z.string().max(10),
  Aggresive: z.boolean(),
});

export const mapNpcSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  MapID: z.int().nonnegative(),
  NpcID: z.int().nonnegative(),
  NpcMapID: z.int().nonnegative(),
  Frame: z.string().max(10)
});

// export const mapBuilderSchema = z.object({
//   id: z.int(),
//   MapID: z.int(),
//   Scale: decimal,
//   Speed: z.int(),
//   Scroll: z.boolean(),
//   Width: z.int(),
//   Height: z.int(),
//   Frame: z.string().max(10),
//   Data: z.json(),
// });