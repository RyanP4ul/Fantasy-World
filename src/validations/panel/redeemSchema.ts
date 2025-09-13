import z from "zod";

export const redeemSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Code: z.string().nonempty().max(60),
  Gold: z.int().nonnegative(),
  Coins: z.int().nonnegative(),
  Exp: z.int().nonnegative(),
  ClassPoints: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  Quantity: z.int().nonnegative(),
  QuantityLeft: z.int().nonnegative(),
  Limited: z.boolean().default(true),
  Expires: z.boolean().default(true),
  DateExpiry: z.coerce.date()
      .transform((val) => new Date(val).toISOString())
});