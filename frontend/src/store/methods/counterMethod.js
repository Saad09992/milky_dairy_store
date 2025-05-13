import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";

export const getDataFromApi = createAsyncThunk("api/users", async () => {
  const response = await api.get("/users");
  console.log(response.data); // Log the response
  return response.data;
});
