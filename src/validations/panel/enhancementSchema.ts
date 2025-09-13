import z from "zod";

export const enhancementSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().nonempty().max(20),
  PatternID: z.int().nonnegative(),
  Rarity: z.int().nonnegative(),
  DPS: z.int().nonnegative(),
  Level: z.int().nonnegative(),
});

export const patternSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().nonempty().max(20),
  Desc: z.string().nonempty().max(4),
  Wisdom: z.int().nonnegative(),
  Strength: z.int().nonnegative(),
  Luck: z.int().nonnegative(),
  Dexterity: z.int().nonnegative(),
  Endurance: z.int().nonnegative(),
  Intelligence: z.int().nonnegative()
});