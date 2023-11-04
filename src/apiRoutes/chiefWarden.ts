import { chiefWardenAPI } from "../config/api";
import { ILogin } from "../interfaces/auth";

// chief warden login
export const login = async (formData: ILogin) =>
  await chiefWardenAPI.post("/auth", formData);
