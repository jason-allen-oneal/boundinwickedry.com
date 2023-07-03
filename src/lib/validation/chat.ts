import { object, string, InferType } from "yup";

let chatSchema = object({
  message: string().required(),
});

export default chatSchema;
export type ChatInput = InferType<typeof chatSchema>;
