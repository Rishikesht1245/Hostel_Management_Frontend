// to store the student details since admission is a three page process
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  blocksForAdmissionAPI,
  fetchActiveMealPlans as MealsForAdmission,
} from "../apiRoutes/student";

interface IAdmissionSlice {
  hostel: any;
  student: any;
}

const initialState = {
  //storing the fetched data
  hostel: {},
  // storing the input data
  student: {},
} as IAdmissionSlice;

//  slice
export const admissionSlice = createSlice({
  name: "AdmissionSlice",
  initialState,
  reducers: {
    studentDetails: (state, action) => {
      state.student = action.payload;
    },
    addBlock: (state, action) => {
      // id of the block
      state.student.block = action.payload._id;
      // for finding the rooms based on rooms selected by student
      state.hostel.selectedBlock = action.payload;
    },
    addMealPlan: (state, action) => {
      state.student.mealPlan = action.payload;
    },
    //reset the store  : returning initial state empty objects
    complete: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    //  fetchBlocksData.fulfilled means "AdmissionSlice/fetchBlockData/fulfilled"
    builder.addCase(fetchBlocksData.fulfilled, (state, action) => {
      return { ...state, hostel: { blocks: action.payload } };
    });
    // return will update the initial state
    builder.addCase(fetchActiveMealPlans.fulfilled, (state, action) => {
      return { ...state, hostel: { mealPlans: action.payload } };
    });
  },
});

//  for dispatching actions
export const admissionActions = admissionSlice.actions;

// createAsyncThunk api calls
// fetch blocks
export const fetchBlocksData = createAsyncThunk(
  "AdmissionSlice/fetchBlocksData",
  async () => {
    const {
      data: { data },
    } = await blocksForAdmissionAPI();
    // action.payload
    return data;
  }
);

// fetch active meal plans
export const fetchActiveMealPlans = createAsyncThunk(
  "AdmissionSlice/fetchActiveMealPlans",
  async () => {
    const {
      data: { data },
    } = await MealsForAdmission();
    return data;
  }
);
