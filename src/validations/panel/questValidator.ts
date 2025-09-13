import z from "zod";
import { decimal, zAlphanumeric } from "../validation";

export const questSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: zAlphanumeric.nonempty().max(64),
  Description: z.string().nonempty(),
  EndText: z.string().nonempty(),
  Experience: z.int().nonnegative().default(0),
  Gold: z.int().nonnegative().default(0),
  Coins: z.int().nonnegative().default(0),
  Reputation: z.int().nonnegative().default(0),
  ClassPoints: z.int().nonnegative().default(0),
  RewardType: z.string().default(""),
  Level: z.int().nonnegative().default(0),
  Upgrade: z.boolean().default(false),
  Once: z.boolean().default(false),
  Slot: z.int().default(-1),
  Value: z.int().default(-1),
  Field: z.string().default(""),
  Index: z.int().default(-1),
  AchievementID: z.int().nullable().optional(),
  TitleID: z.int().nullable().optional(),
  FactionID: z.int().nonnegative().default(-1),
  ReqReputation: z.int().nonnegative().default(0),
  ReqClassID: z.int().nonnegative().optional().default(0),
  ReqClassPoints: z.int().nonnegative().default(0),
});

export const reqSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  QuestID: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  Quantity: z.int().nonnegative(),
});

export const rewardSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  QuestID: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  Quantity: z.int().nonnegative(),
  Rate: decimal,
  RewardType: z.string().nonempty(),
});