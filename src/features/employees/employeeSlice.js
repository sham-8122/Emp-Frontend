import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Fetch with Search & Pagination

// Fetch with Search, Pagination, Sort & Filter
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async ({ page = 1, search = "", sort = "createdAt_DESC", role = "" } = {}) => {
    // Pass all query params to the API
    const response = await API.get(`/employees?page=${page}&limit=5&search=${search}&sort=${sort}&role=${role}`);
    return response.data;
  }
);

export const addEmployee = createAsyncThunk("employees/addEmployee", async (data) => {
  const response = await API.post("/employees", data);
  return response.data;
});

export const updateEmployee = createAsyncThunk("employees/updateEmployee", async ({ id, updatedData }) => {
  const response = await API.put(`/employees/${id}`, updatedData);
  return response.data;
});

export const deleteEmployee = createAsyncThunk("employees/deleteEmployee", async (id) => {
  await API.delete(`/employees/${id}`);
  return id;
});

export const fetchEmployeeStats = createAsyncThunk("employees/fetchEmployeeStats", async () => {
  const response = await API.get("/employees/stats");
  return response.data;
});
export const fetchHistory = createAsyncThunk("employees/fetchHistory", async (id) => {
  const response = await API.get(`/employees/${id}/history`);
  return response.data;
});


const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: false,
    totalPages: 0,
    currentPage: 1,
    stats: { totalEmployees: 0, totalSalary: 0, averageSalary: 0, highestPaidEmployee: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.loading = true; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.employees;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchEmployees.rejected, (state) => { state.loading = false; })
      .addCase(fetchEmployeeStats.fulfilled, (state, action) => { state.stats = action.payload; });
  },
});

export default employeeSlice.reducer;