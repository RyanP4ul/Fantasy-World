import z from "zod";

export const classSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  Category: z.enum(["M1", "M2", "M3", "M4", "S1", "C1", "C2", "C3"]),
  Description: z.string().nonempty(),
  ManaRegenerationMethods: z.string().nonempty(),
  StatsDescription: z.string().nonempty(),
});