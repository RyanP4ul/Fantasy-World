import { z } from "zod";

export const zAlphanumeric = z.string().trim().regex(/^[A-Za-z0-9 ]+$/, "Only letters and numbers are allowed");

export const decimal = z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Must be a valid decimal");

export const hexColorSchema = z.string().regex(
  /^#(?:[0-9a-fA-F]{3}){1,2}$/,
  "Invalid hex color"
);

// export const MAX_FILE_SIZE = 5 * 1024 * 1024;
// export const ACCEPTED_FILE_TYPES = [
//   "application/x-shockwave-flash",
//   "image/png",
//   "image/jpeg",
// ];

// export const fileSchema = z
//   .instanceof(FileList)
//   .refine((files) => files.length > 0, {
//     message: "Please upload a file.",
//   })
//   .transform((files) => files[0]!) // <-- take the first file
//   .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
//     message: "Only .swf, .png, and .jpg files are allowed.",
//   })
//   .refine((file) => file.size <= MAX_FILE_SIZE, {
//     message: `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
//   });

// export const uploadFormSchema = z.object({
//   file: fileSchema,
// });

// export type UploadFormValues = z.infer<typeof uploadFormSchema>;