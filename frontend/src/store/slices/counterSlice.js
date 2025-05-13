import { createSlice } from "@reduxjs/toolkit";
import { getDataFromApi } from "../methods/counterMethod";
export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 0,
    users: [],
  },
  reducers: {
    incrementCount: (state) => {
      state.count += 1;
    },
    clearCount: (state) => {
      state.count = 0;
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataFromApi.fulfilled, (state, action) => {
        console.log(action.payload);
        state.users = action.payload || [];
      })
      .addCase(getDataFromApi.rejected, (state) => {});
  },
});

export const { incrementCount, clearCount, clearUsers } = counterSlice.actions;

export default counterSlice.reducer;
