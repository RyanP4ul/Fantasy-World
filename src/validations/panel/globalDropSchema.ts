import z from "zod";
import { decimal } from "../validation";

export const globalDropSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  Chance: decimal,
  Quantity: z.int().nonnegative()
});