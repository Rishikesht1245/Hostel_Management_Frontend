import { staffAPI } from "../config/api";
import { ILogin } from "../interfaces/auth";

// login staff
export const login = async (formData: ILogin) =>
  await staffAPI.post("/auth", formData);
