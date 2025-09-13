import z from "zod";
import { hexColorSchema, zAlphanumeric } from "../validation";

export const npcSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().nonempty().max(50),
  TextNameColor: hexColorSchema.nonempty().default(""),
  TextGuild: z.string().max(50).optional(),
  TextGuildColor: hexColorSchema.nonempty().default(""),
  EntityType: z.enum(["Humanoid", "Generic"]),
});

export const contentSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  MapID: z.int().nonnegative(),
  NpcID: z.int().nonnegative(),
  Category: z.string().nonempty().max(50),
  Description: z.string().nonempty().max(255),
  Entry: z.enum(["Left", "Right", "Center"]),
  Label: zAlphanumeric.max(20)
});

export const actionSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  ContentID: z.int().nonnegative(),
  Title: z.string().nonempty().max(50),
  TitleColor: hexColorSchema.nonempty().default(""),
  SubTitle: z.string().max(50).optional(),
  SubTitleColor: hexColorSchema.nonempty().default(""),
  Position: z.enum(["Auto", "Center"]),
  Icon: z.string().nonempty().max(50),
  Action: z.enum(["Goto", "Shop", "Map", "Quest", "Link", "Move", "Test"]),
  Value: z.string().nonempty().max(15),
});

export const genericSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  NpcID: z.int().nonnegative(),
  File: z
    .string()
    .regex(
      /^npcs\/[A-Za-z0-9._-]+\.swf$/,
      "Filename must be inside 'npcs/' and end with .swf"
    ),
  Linkage: z.string().nonempty().max(50),
});

export const humanoidSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  NpcID: z.int().nonnegative(),
  Gender: z.enum(["M", "F"]),
  ColorHair: hexColorSchema.nonempty().default(""),
  ColorSkin: hexColorSchema.nonempty().default(""),
  ColorEye: hexColorSchema.nonempty().default(""),
  ColorBase: hexColorSchema.nonempty().default(""),
  ColorTrim: hexColorSchema.nonempty().default(""),
  ColorAccessory: hexColorSchema.nonempty().default(""),
  Equipments: z.string().nonempty().max(50),
});
