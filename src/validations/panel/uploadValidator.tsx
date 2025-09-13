import z from "zod";

export const fileSchema = z.object({
    files: z
    .array(
      z.custom<File>()
        .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
        .refine(
          (file) => ["image/png", "image/jpeg", "application/x-shockwave-flash"].includes(file.type),
          "Only PNG, JPG, or SWF files are allowed"
        )
    )
    .min(1, "At least one file is required"),
    
  paths: z.array(z.string().min(1, "Path is required")),
  // path: z.string().nonempty().max(20),
  // file: z
  //   .any()
  //   .refine((file) => file instanceof File, "File is required")
  //   .refine(
  //     (file) =>
  //       ["image/png", "image/jpeg", "application/x-shockwave-flash"].includes(
  //         file?.type
  //       ),
  //     "Only PNG, JPG, or SWF files are allowed"
  //   ),
});

export type FileSchema = z.infer<typeof fileSchema>;