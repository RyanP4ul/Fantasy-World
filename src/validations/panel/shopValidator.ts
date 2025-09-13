import z from "zod";
import { zAlphanumeric } from "../validation";

export const shopSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: zAlphanumeric.max(32),
  House: z.boolean().default(false),
  Upgrade: z.boolean().default(false),
  Staff: z.boolean().default(false),
  Limited: z.boolean().default(false),
});

export const itemSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int(),
  ShopID: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  QuantityRemain: z.int().nonnegative(),
});

export const seasonalSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  ShopID: z.int().nonnegative(),
  EndDate: z.coerce.date()
    .transform((val) => new Date(val).toISOString())
});
