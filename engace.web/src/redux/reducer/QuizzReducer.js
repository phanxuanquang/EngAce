import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  qaList: [],
  topics: [],
  qTypes: [],
};

const quizzSlice = createSlice({
  name: "quizzSlice",
  initialState,
  reducers: {
    getTopicsSuccess: (state, action) => {
      state.topics = action.payload.topics;
    },
    getQuizzTypesSuccess: (state, action) => {
      state.qTypes = action.payload.qTypes;
    },
  },
});

export const quizzActions = quizzSlice.actions;

export default quizzSlice.reducer;
