import { chiefWardenAPI } from "../config/api";
import { ILogin, IResetPassword } from "../interfaces/auth";
import { AddBlock } from "../interfaces/blocks";
import { IComplaintUpdate } from "../interfaces/complaints";
import { INotice } from "../interfaces/notice";
import { IMealPlan } from "../interfaces/staff";
import { setApiHeader } from "../utils/apiHeader";

// chief warden login

export const login = async (formData: ILogin) =>
  await chiefWardenAPI.post("/auth", formData);

// reset password
export const resetPasswordAPI = async (passwordData: IResetPassword) =>
  await chiefWardenAPI.patch("/auth", passwordData, setApiHeader());

// ------------------------------- MEAL PLANS ---------------------------- //
// fetch all meal plans
export const fetchAllMealPlans = async () =>
  await chiefWardenAPI.get("/mealPlans", setApiHeader());

// Change availability of Meal plan
export const changeAvailabilityMealPlanCW = async (_id: string) =>
  await chiefWardenAPI.patch(`/mealPlans/${_id}`, "", setApiHeader());

// add new meal plan
export const addNewMealPlanCW = async (formData: IMealPlan) =>
  await chiefWardenAPI.post("/mealPlans", formData, setApiHeader());

// update meal plan
export const updateMealPlanCW = async (_id: string, formData: IMealPlan) =>
  await chiefWardenAPI.put(`/mealPlans/${_id}`, formData, setApiHeader());

//  ---------------------------- BLOCKS  ---------------------------------- //
// fetch all blocks
export const fetchAllBlocksAPI = async () =>
  await chiefWardenAPI.get("/blocks", setApiHeader());

//fetch single block
export const fetchBlockAPI = async (blockName: string) =>
  await chiefWardenAPI.get(`/blocks/name/${blockName}`, setApiHeader());

// add new block
export const addNewBlockCW = async (formData: AddBlock) =>
  await chiefWardenAPI.post("/blocks", formData, setApiHeader());

// check room availability
export const checkRoomAvailabilityAPI = async (roomCode: string) =>
  await chiefWardenAPI.get(
    `/blocks/rooms/availability/${roomCode}`,
    setApiHeader()
  );

// available rooms
export const fetchAvailableRoomsAPI = async (blockId: string) =>
  await chiefWardenAPI.get(
    `/blocks/rooms/availableRooms/${blockId}`,
    setApiHeader()
  );

// ------------------------------- STAFFS -------------------------------- //

// fetch all staffs : filter and search is passed as query (filterObj in backend)
export const fetchAllStaffsAPI = async (
  filter: string = "",
  name: string = ""
) =>
  await chiefWardenAPI.get(
    `/staffs?role=${filter}&name=${name}`,
    setApiHeader()
  );

//new Staff API
export const newStaffAPI = async (formData: any) =>
  await chiefWardenAPI.post("/staffs", formData, setApiHeader());

//staffs by department
export const fetchStaffsByDeptAPI = async (department: string) =>
  await chiefWardenAPI.get(`/staffs/department/${department}`, setApiHeader());

//complaints by staff
export const complaintsByStaffAPI = async (_id: string) =>
  await chiefWardenAPI.get(`/staffs/${_id}`, setApiHeader());

// ------------------------------- STUDENTS -------------------------------- //

// get all students
export const fetchAllStudentsAPI = async (
  filter: string = "",
  search: string = ""
) =>
  await chiefWardenAPI.get(
    `/students/all?status=${filter}&name=${search}`,
    setApiHeader()
  );

/* update student - _id : id of the student , data : data to update like allot 
room depart or make pending student to resident */
export const updateSingleStudentAPI = async (_id: string, data: any) =>
  await chiefWardenAPI.patch(`/students/${_id}`, data, setApiHeader());

// -------------------------- COMPLAINTS ------------------------------- //
// fetch all complaints
export const fetchAllComplaintsAPI = async (filterBy: string = "") =>
  await chiefWardenAPI.get(`/complaints?status=${filterBy}`, setApiHeader());

// update complaints
export const updateComplaintAPI = async (_id: string, data: IComplaintUpdate) =>
  await chiefWardenAPI.patch(`/complaints/${_id}`, data, setApiHeader());

// -------------------------- Notices ------------------------------- //
// all notices
export const fetchAllNoticesAPI = async () =>
  await chiefWardenAPI.get("/notices/all", setApiHeader());

// Chang notice visibility
export const changeNoticeVisibilityAPI = async (_id: string, data: INotice) =>
  await chiefWardenAPI.patch(`/notices/${_id}`, data, setApiHeader());

// New Notice
export const newNoticeAPI = async (formData: INotice) =>
  await chiefWardenAPI.post("/notices", formData, setApiHeader());

// Update notice
export const updateNoticeAPI = async (_id: string, formData: INotice) =>
  await chiefWardenAPI.put(`notices/${_id}`, formData, setApiHeader());

//  Delete notice
export const deleteNoticeAPI = async (_id: string) =>
  await chiefWardenAPI.delete(`/notices/${_id}`, setApiHeader());

// -------------------------- DASHBOARD  ------------------------------- //

// Notice statistics
export const noticeStatisticsAPI = async () =>
  await chiefWardenAPI.get("/notices/statistics", setApiHeader());

//  Payment statistics
export const paymentStatisticsAPI = async () =>
  await chiefWardenAPI.get("/students/paymentStatus", setApiHeader());

//  Complaint statistics
export const complaintStatisticsAPI = async () =>
  await chiefWardenAPI.get("/complaints/statistics", setApiHeader());

// Occupancy statistics
export const occupancyStatisticsAPI = async () =>
  await chiefWardenAPI.get("/blocks/occupancyStatistics", setApiHeader());

// Yearly revenue
export const yearlyRevenueAPI = async () =>
  await chiefWardenAPI.get("/payments/yearlyRevenue", setApiHeader());

// Fetch all chats
export const fetchAllChatsAPI = async (room: "student" | "staff") =>
  await chiefWardenAPI.get(`/chats/${room}`, setApiHeader());
