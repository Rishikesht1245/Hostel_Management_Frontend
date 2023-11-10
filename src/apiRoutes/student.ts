import { studentAPI } from "../config/api";
import { ILogin, IResetPassword } from "../interfaces/auth";
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

// reset Password
export const resetPasswordAPI = async (passwordData: IResetPassword) =>
  await studentAPI.patch("/auth", passwordData, setApiHeader());

//get active meal plans
export const fetchActiveMealPlansAPI = async () =>
  await studentAPI.get("/mealPlans", setApiHeader());

// get selected Meal Plan
export const selectedMealPlanAPI = async () =>
  await studentAPI.get("/mealPlan", setApiHeader());

// Update meal plan
export const updateMealPlanAPI = async (data: object) =>
  await studentAPI.post("/mealPlan", data, setApiHeader());

// Update profile image
export const changeProfileImageAPI = async (imageAsBase64: string) =>
  await studentAPI.patch(
    "/profile",
    { profilePic: imageAsBase64 },
    setApiHeader()
  );
