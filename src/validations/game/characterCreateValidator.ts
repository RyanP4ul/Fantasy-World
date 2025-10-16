import z from "zod";
import { zAlphanumeric } from "../validation";

export const createSchema = z.object({
  userId: z.coerce.number().int().nonnegative(),
  name: zAlphanumeric.min(3).max(15),
  gender: z.enum(["M", "F"]),
  hairId: z.coerce.number().int().nonnegative(),
  // color: z.string().max(255),
  color: z.object({
    hair: z.number(),
    skin: z.number(),
    eye: z.number(),
    base: z.number(),
    trim: z.number(),
    accessory: z.number()
  }),
  items: z.string().max(5)
});