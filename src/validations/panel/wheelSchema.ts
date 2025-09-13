import z from "zod";
import { decimal } from "../validation";

export const wheelSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  ItemID: z.int(),
  Chance: decimal,
  Quantity: z.int().nonnegative().default(1)
});