import { object, string, InferType } from "yup";

let contactSchema = object({
  firstName: string().min(2).max(64).required(),
  lastName: string().min(2).max(64).required(),
  email: string().email().required(),
  message: string().min(1).required()
});

export default contactSchema;
export type ContactInput = InferType<typeof contactSchema>;
