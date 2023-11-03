import { studentAPI } from "../config/api";
import { ILogin } from "../interfaces/auth";

// Login student
export const login = async (formData: ILogin) =>
  await studentAPI.post("/auth", formData);
