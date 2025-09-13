import z from "zod";
import { zAlphanumeric, decimal } from "../validation";

export const monsterSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int(),
  Name: zAlphanumeric.max(32),
  Category: z.string().trim().max(2).default("M1"),
  File: z.string().trim().regex(/^[A-Za-z0-9 ]+\.swf$/i, {message: "Filename must be alphanumeric and end with .swf"}).nonempty(),
  Linkage: z.string().trim().max(32).nonempty(),
  Level: z.int().min(1).default(1),
  Health: z.int().min(0).default(1000),
  Mana: z.int().min(0).default(100),
  Gold: z.int().min(0).default(0),
  Coin: z.int().min(0).default(0),
  Experience: z.int().min(0).default(0),
  ClassPoint: z.int().min(0).default(0),
  Reputation: z.int().min(0).default(0),
  Respawn: z.int().min(0).default(6),
  Speed: z.int().min(0).default(1500),
  Damage: decimal,
  DamageType: z.string().trim().max(10),
  Immune: z.boolean(),
  WorldBoss: z.boolean(),
});

export const bossSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  MonsterID: z.int().nonnegative(),
  MapID: z.int().nonnegative(),
  SpawnInterval: z.int().nonnegative(),
  TimeLimit: z.int().nonnegative(),
  Description: z.string().trim().max(255),
});

export const dropSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  MonsterID: z.int().nonnegative(),
  ItemID: z.int().nonnegative(),
  Chance: decimal,
  Quantity: z.int().nonnegative().default(1),
});

export const skillSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  MonsterID: z.int().nonnegative(),
  SkillID: z.int().nonnegative()
});