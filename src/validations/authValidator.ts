import z from "zod";
import { zAlphanumeric } from "./validation";

export const loginSchema = z.object({
  username: zAlphanumeric.min(4).max(15),
  password: z.string().nonempty().max(30)
});

export const registerSchema = z.object({
  username: zAlphanumeric.min(4).max(15),
  email: z.email(),
  gender: z.enum(["M", "F"]),
  password: z.string().nonempty().max(30),
  retype_password: z.string().nonempty(),
});

export const changePasswordSchema = z.object({
  current_password: z.string().nonempty().max(30),
  new_password: z.string().nonempty().max(30),
  confirm_password: z.string().nonempty().max(30),
  captcha: z.string().nonempty(),
});