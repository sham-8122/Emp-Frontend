import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchDeductions = createAsyncThunk("deductions/fetch", async (empCode) => {
  const response = await API.get(`/employees/${empCode}/deductions`);
  return response.data;
});

export const addDeduction = createAsyncThunk("deductions/add", async ({ empCode, data }) => {
  const response = await API.post(`/employees/${empCode}/deductions`, data);
  return response.data;
});

export const removeDeduction = createAsyncThunk("deductions/remove", async (id) => {
  await API.delete(`/employees/deductions/${id}`);
  return id;
});

const deductionSlice = createSlice({
  name: "deductions",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeductions.pending, (state) => { state.loading = true; })
      .addCase(fetchDeductions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addDeduction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(removeDeduction.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  }
});

export default deductionSlice.reducer;