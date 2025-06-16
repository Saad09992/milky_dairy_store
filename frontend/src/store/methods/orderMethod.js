import { createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../../services/order.service";

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (page, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrder(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ amount, total, reference, paymentMethod, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(amount, total, reference, paymentMethod, paymentDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
); 