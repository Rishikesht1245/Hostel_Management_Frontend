import { staffAPI } from "../config/api";
import { ILogin } from "../interfaces/auth";
import { IMealPlan } from "../interfaces/staff";
import { setApiHeader } from "../utils/apiHeader";

// login staff
export const login = async (formData: ILogin) =>
  await staffAPI.post("/auth", formData);

// ----- MEAL PLANS ----- //
//add new meal plan
export const addNewMealPlan = async (formData: IMealPlan) =>
  await staffAPI.post("/meals", formData, setApiHeader());

// update meal plan
export const updateMealPlan = async (_id: string, formData: IMealPlan) =>
  await staffAPI.put(`meals/${_id}`, formData, setApiHeader());