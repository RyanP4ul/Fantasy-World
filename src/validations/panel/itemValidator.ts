import z from "zod";
import { zAlphanumeric, decimal } from "../validation";

export const itemSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: zAlphanumeric.min(3).max(32),
  Description: z.string().nullable(),
  Type: z.string().max(16),
  File: z.string().max(120),
  Link: z.string().max(64),
  Icon: z.string().max(16),
  Equipment: z.string().max(10).nullable().optional(),
  // Equipment: z.enum(["none", "Item", "Weapon", "co", "ar", "ba", "he", "pe", "mi"]),
  Level: z.int().nonnegative(),
  DPS: z.int().nonnegative(),
  Range: z.int().nonnegative().max(500),
  Rarity: z.int().nonnegative(),
  Quantity: z.int().nonnegative().max(999),
  Stack: z.int().nonnegative().max(99999999),
  Cost: z.int().nonnegative().max(99999999),
  Coins: z.boolean().optional(),
  Sell: z.boolean().optional(),
  Temporary: z.boolean().optional(),
  Upgrade: z.boolean().optional(),
  Staff: z.boolean().optional(),
  EnhID: z.int().optional(),
  FactionID: z.int().optional(),
  ReqReputation: z.int().nonnegative().max(302500),
  ReqClassID: z.int(),
  ReqClassPoints: z.int(),
  QuestStringIndex: z.int(),
  QuestStringValue: z.int(),
  ReqQuests: z.string().max(32).nullable(),
  Trade: z.boolean().optional(),
  Market: z.boolean().optional(),
  Meta: z.string().max(32).nullable()
});

export const requirementSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  ReqItemID: z.int().nonnegative(),
  Quantity: z.int().nonnegative(),
});

export const skillSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  SkillID: z.int().nonnegative(),
});