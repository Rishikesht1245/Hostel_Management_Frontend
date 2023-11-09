import { studentAPI } from "../config/api";
import { ILogin } from "../interfaces/auth";
import { IStudent } from "../interfaces/student";
import { setApiHeader } from "../utils/apiHeader";

// Login student
export const login = async (formData: ILogin) =>
  await studentAPI.post("/auth", formData);

// fetch blocks for admission
export const blocksForAdmissionAPI = async () =>
  await studentAPI.get("/newAdmission/blocks");

//fetch meal plans for admission
export const fetchActiveMealPlans = async () =>
  await studentAPI.get("/newAdmission/mealPlans");

//new Admission
export const newAdmissionAPI = async (studentData: IStudent) =>
  await studentAPI.post("/newAdmission", studentData);

//get active meal plans
export const fetchActiveMealPlansAPI = async () =>
  await studentAPI.get("/mealPlans", setApiHeader());

// get selected Meal Plan
export const selectedMealPlanAPI = async () =>
  await studentAPI.get("/mealPlan", setApiHeader());

// Update meal plan
export const updateMealPlanAPI = async (data: object) =>
  await studentAPI.post("/mealPlan", data, setApiHeader());
