import z from "zod";

export const bookSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().max(50).nonempty(),
  File: z.string().max(50).nonempty(),
  Linkage: z.string().max(50).nonempty(),
  Level: z.int().nonnegative(),
  Lock: z.string().optional(),
  Description: z.string(),
  Map: z.string().max(50).optional(),
  Type: z.string().max(50).nonempty(),
  Hide: z.boolean().default(false),
  Label: z.string().max(50).optional(),
  Shop: z.int().nonnegative().optional(),
  Field: z.string().max(50).nonempty(),
  Index: z.int().nonnegative().optional(),
  Value: z.int().nonnegative().optional()
});

export const questSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Name: z.string().max(50).nonempty(),
  Field: z.string().max(50).nonempty(),
  Lock: z.string().optional(),
  Map: z.string().max(50).optional(),
  Type: z.string().max(50).nonempty(),
  Hide: z.boolean().default(false),
  Index: z.int().nonnegative().optional(),
  Value: z.int().nonnegative().optional()
});