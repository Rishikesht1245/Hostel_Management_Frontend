import { staffAPI } from "../config/api";
import { ILogin, IResetPassword } from "../interfaces/auth";
import { IMealPlan } from "../interfaces/staff";
import { setApiHeader } from "../utils/apiHeader";

// login staff
export const login = async (formData: ILogin) =>
  await staffAPI.post("/auth", formData);

// ------------------- MEAL PLANS --------------------//

//fetch all meal plans
export const fetchAllMealPlans = async () =>
  await staffAPI.get("/meals/all", setApiHeader());

// change activity
export const changeAvailabilityMealPlan = async (_id: string) =>
  await staffAPI.patch(`/meals/${_id}`, "", setApiHeader());

//add new meal plan
export const addNewMealPlan = async (formData: IMealPlan) =>
  await staffAPI.post("/meals", formData, setApiHeader());

// update meal plan
export const updateMealPlan = async (_id: string, formData: IMealPlan) =>
  await staffAPI.put(`meals/${_id}`, formData, setApiHeader());

//----------------- BLOCKS AND ROOMS --------------------- //
export const fetchAllBlocksAPI = async () =>
  await staffAPI.get("/maintenance", setApiHeader());

// fetch block by name
export const fetchBlockAPI = async (blockName: string) =>
  await staffAPI.get(`/maintenance/${blockName}`, setApiHeader());

// change room's availability
export const changeAvailabilityAPI = async (roomCode: string) =>
  staffAPI.patch(`/maintenance/room/${roomCode}`, "", setApiHeader());

// upload profile image
export const changeProfileImageAPI = async (imageAsBase64: string) =>
  await staffAPI.patch(
    "/profile",
    { profilePic: imageAsBase64 },
    setApiHeader()
  );

//Reset password API
export const resetPasswordAPI = async (passwordData: IResetPassword) =>
  await staffAPI.patch("/auth", passwordData, setApiHeader());
