import { createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/product.service";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (page, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productService.getProduct(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);
