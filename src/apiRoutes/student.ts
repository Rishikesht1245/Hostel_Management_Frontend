import { studentAPI } from "../config/api";
import { ILogin } from "../interfaces/auth";
import { IStudent } from "../interfaces/student";

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
