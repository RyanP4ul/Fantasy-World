import z from "zod";

export const webPostSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  UserID: z.int().nonnegative(),
  Title: z.string().nonempty().max(50),
  Content: z.string().nonempty(),
  Category: z.string().nonempty().max(50),
  Image: z.string().optional(),
});

export const webSettingSchema = z.object({
  MaxRegisterPerDay: z.int().nonnegative().max(20),
  MaxAccountPerIp: z.int().nonnegative().max(3),
  CanRegister: z.boolean(),
  IsMaintenance: z.boolean(),
  IsStaffOnly: z.boolean(),
});

export type WebSettingFormData = z.infer<typeof webSettingSchema>; 