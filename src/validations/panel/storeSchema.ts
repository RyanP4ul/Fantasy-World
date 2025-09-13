import z from "zod";
import { decimal, zAlphanumeric } from "../validation";

export const storeSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: zAlphanumeric.nonempty().max(50),
  Category: z.string().max(50),
  Description: z.string(),
  Images: z.string().default(""),
  Price: decimal,
  Gold: z.int().min(0).default(0),
  Coins: z.int().min(0).default(0),
  TitleID: z.int().optional(),
  AchievementID: z.int().optional(),
  UpgradeDays: z.int().nonnegative(),
  QuantityRemain: z.int().min(0).default(0)
});

export const storeItemSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  StoreID: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  Quantity: z.int().nonnegative()
});