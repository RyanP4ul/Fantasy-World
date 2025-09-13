import z from "zod";
import { hexColorSchema } from "../validation";

export const titleSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().nonempty().max(20),
  Description: z.string().max(100),
  Strength: z.int().nonnegative().default(0),
  Intellect: z.int().nonnegative().default(0),
  Endurance: z.int().nonnegative().default(0),
  Dexterity: z.int().nonnegative().default(0),
  Wisdom: z.int().nonnegative().default(0),
  Luck: z.int().nonnegative().default(0),
  Color: hexColorSchema.nonempty().default(""),
});

export const decorationSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().nonempty().max(50),
  Description: z.string().nonempty(),
  File: z.string().nonempty().max(50),
  Linkage: z.string().nonempty().max(50)
});