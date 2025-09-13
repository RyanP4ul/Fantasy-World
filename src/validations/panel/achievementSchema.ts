import z from "zod";

export const achievementSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().nonempty().max(64),
  Image: z.string().nonempty(),
  Description: z.string().nonempty(),
});