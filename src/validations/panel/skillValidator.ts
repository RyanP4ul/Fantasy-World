import z from "zod";
import { zAlphanumeric, decimal } from "../validation";

export const skillSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: zAlphanumeric.min(4).max(32),
  Animation: z.string().trim().max(64),
  Description: z.string(),
  Damage: decimal,
  Mana: z.int().nonnegative().max(999),
  Icon: z.string().min(3).max(32),
  Range: z.int().min(100).max(3000),
  Reference: z.enum(["aa", "a1", "a2", "a3", "a4", "p1", "p2", "p3", "i1", "i2"], { message: "Invalid reference" }),
  Target: z.enum(["h", "s", "f"]),
  Effects: z.enum(["c", "f", "p", "w"]),
  Type: z.enum(["p", "m", "ma", "mp", "pm", "passive"]),
  Strl: z.string(),
  Cooldown: z.int().nonnegative().default(2000),
  HitTargets: z.int().nonnegative().default(1),
  CanHit: z.boolean().default(true),
  CanMiss: z.boolean().default(true),
  CanDodge: z.boolean().default(true),
  CanCrit: z.boolean().default(true),
  AlwaysCrit: z.boolean().default(false),
  RestoreHealth: z.int().nonnegative().default(0),
  RestoreMana: z.int().nonnegative().default(0),
  RestoreHealthPercent: decimal.default("0.0"),
  RestoreManaPercent: decimal.default("0.0"),
  MultiAttack: z.int().nonnegative().default(1),
});

export const assignSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int(),
  SkillID: z.int(),
  ItemID: z.int()
});

export const auraSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int(),
  SkillID: z.int().nonnegative(),
  AuraID: z.int().nonnegative(),
  ReqAuraID: z.int().nonnegative().nullable(),
  NoAuraID: z.int().nonnegative().nullable(),
  ReqStack: z.int().nonnegative().default(0),
  ConsumeStack: z.int().nonnegative().default(0),
  ConsumeAuraID: z.int().nonnegative().nullable()
});