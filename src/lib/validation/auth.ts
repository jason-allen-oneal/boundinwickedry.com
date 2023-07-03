import { object, string, number, InferType } from "yup";

export let loginSchema = object({
  email: string().email(),
  password: string().min(4).max(64),
  callbackUrl: string(),
});

export let registerSchema = object({
  name: string().min(3).max(60),
  email: string().email(),
  password: string().min(4).max(64),
  fullname: string().min(2).max(64),
  subtype: number(),
});

export type LoginInput = InferType<typeof loginSchema>;
export type RegisterInput = InferType<typeof registerSchema>;
