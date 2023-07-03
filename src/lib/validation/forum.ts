import { object, string, number, InferType } from "yup";

let topicSchema = object({
  title: string().min(4).max(64),
  body: string(),
  category: number(),
});

export default topicSchema;
export type TopicInput = InferType<typeof topicSchema>;
