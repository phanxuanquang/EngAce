import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  qaList: [],
  topics: [],
  qTypes: [],
};

const quizSlice = createSlice({
  name: "quizzSlice",
  initialState,
  reducers: {
    getTopicsSuccess: (state, action) => {
      state.topics = action.payload.topics;
    },
    getQuizTypesSuccess: (state, action) => {
      state.qTypes = action.payload.qTypes;
    },

    createQuizzesSuccess: (state, action) => {
      state.qaList = action.payload.qaList;
    },
  },
});

export const quizActions = quizSlice.actions;

export default quizSlice.reducer;
