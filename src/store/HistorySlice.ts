import { createSlice } from "@reduxjs/toolkit";

//  History slice
export const historySlice = createSlice({
  name: "HistorySlice",
  initialState: null as string | null,
  reducers: {
    addHistory: (state, action) => {
      console.log(state);
      return action.payload;
    },
  },
});

export const { addHistory } = historySlice.actions;
