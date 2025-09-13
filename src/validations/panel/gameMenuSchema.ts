import z from "zod";

export const gameMenuSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Text: z.string().nonempty().max(20),
  Action: z.enum(['Nothing','PvP','NavigateURL','WorldMap','GotoAndPlay','GotoAndStop','Item Shop','Hair Shop','Enhance Shop','/Join','News','Membership']),
  ActID: z.int().nonnegative().optional(),
  String: z.string().max(100).optional(),
  ParentFrame: z.string().max(100).optional(),
  Frame: z.string().max(100).optional(),
  Pad: z.string().max(100).optional(),
  Icon: z.string().max(100).optional(),
  SubHeaderText: z.string().max(100).optional(),
  SubHeaderColor: z.string().max(100).optional(),
  Style: z.string().max(100).optional(),
  AltMode: z.string().max(100).optional(),
  AltText: z.string().max(100).optional(),
  AltIcon: z.string().max(100).optional(),
  AltSubHeaderText: z.string().max(100).optional(),
  AltSubHeaderColor: z.string().max(100).optional()
});

export const newsSchema = z.object({
  oldId: z.coerce.number().int().nullable(),
  id: z.int().nonnegative(),
  Label: z.string().nonempty().max(100),
  Image: z.string().nonempty().max(100),
  Button1: z.string().nonempty().max(100),
  Button2: z.string().nonempty().max(100),
});