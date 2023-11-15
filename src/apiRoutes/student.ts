import { studentAPI } from "../config/api";
import { ILogin, IResetPassword } from "../interfaces/auth";
import { SuccessfulPayment } from "../interfaces/payment";
import { IStudent } from "../interfaces/student";
import { setApiHeader } from "../utils/apiHeader";

// ----------------------------- AUTH ---------------------------- //
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

//-------------------------- MEAL PLANS -------------------------------//

//get active meal plans
export const fetchActiveMealPlansAPI = async () =>
  await studentAPI.get("/mealPlans", setApiHeader());

// get selected Meal Plan
export const selectedMealPlanAPI = async () =>
  await studentAPI.get("/mealPlan", setApiHeader());

// Update meal plan
export const updateMealPlanAPI = async (data: object) =>
  await studentAPI.post("/mealPlan", data, setApiHeader());

//---------------------------- PROFILE ----------------------------- //

// Single student data
export const currentStudentAPI = async () =>
  await studentAPI.get("/", setApiHeader());

// Update profile image
export const changeProfileImageAPI = async (imageAsBase64: string) =>
  await studentAPI.patch(
    "/profile",
    { profilePic: imageAsBase64 },
    setApiHeader()
  );

// --------------------------- COMPLAINTS -------------------------- //
// get all complaints
export const getAllComplaintsAPI = async (filter: string = "") =>
  await studentAPI.get(`/complaints?status=${filter}`, setApiHeader());

// new complaint
export const newComplaintAPI = async (data: {
  department: "warden" | "chef" | "maintenance";
  message: string;
}) => await studentAPI.post("/complaints", data, setApiHeader());

// --------------------------- PAYMENTS -------------------------- //

// fetch payments
export const fetchPaymentsAPI = async () =>
  await studentAPI.get("/payments", setApiHeader());

// initiate payment API
export const initiatePaymentAPI = async (amount: number) =>
  await studentAPI.patch("/payments", { amount }, setApiHeader());

// Successful payments API
export const successfulPaymentAPI = async (data: SuccessfulPayment) =>
  await studentAPI.post("/payments", data, setApiHeader());
