import z from "zod";
import { decimal } from "../validation";

export const auraEffectSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  AuraID: z.int().nonnegative(),
  Stat: z.string().max(32),
  Value: decimal,
  Type: z.enum(["+", "-", "*"]),
});