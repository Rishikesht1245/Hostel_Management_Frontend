import { ICurrentUser } from "../interfaces/auth";
import { ILoginResponse, IRole } from "../interfaces/auth";

export const saveLocally = (
  token: string,
  data: ILoginResponse,
  role: IRole
): void => {
  const saveData = {
    token: token,
    currentUser: data,
    role,
  };
  localStorage.setItem("hostelManagement", JSON.stringify(saveData));
};

export const getLocalData = (): ICurrentUser | null => {
  const localData: string | null = localStorage.getItem("hostelManagement");
  if (!localData) return null;
  return JSON.parse(localData);
};

export const removeLocalData = () => {
  localStorage.removeItem("hostelManagement");
};

export const getToken = (): string | undefined => {
  return getLocalData()?.token;
};
