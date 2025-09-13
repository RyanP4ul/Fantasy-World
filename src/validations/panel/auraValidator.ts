import z from "zod";
import { zAlphanumeric, decimal } from "../validation";

export const auraSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: zAlphanumeric.max(32),
  Duration: z.int().nonnegative().max(20),
  Speed: z.int().min(0).min(2).max(20),
  Category: z.string().nonempty().max(8),
  Chance: decimal, //z.number(),
  Target: z.enum(["h", "s", "f"]),
  MaxStack: z.int().min(0),
  CriticalHits: z.int().nonnegative().min(0).max(20)
});