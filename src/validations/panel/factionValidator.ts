import z from "zod";

export const factionSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().nonempty().max(20)
});