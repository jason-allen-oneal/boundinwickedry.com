import { object, string, InferType } from "yup";

let dashboardSchema = object({
  email: string().email(),
  username: string().min(3).max(30),
  password: string(),
  bio: string(),
});

export default dashboardSchema;
export type DashboardInput = InferType<typeof dashboardSchema>;
