import { createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cart.service";
import localCart from "../../helpers/localCart";

export const initializeCart = createAsyncThunk(
  "cart/initializeCart",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      if (isLoggedIn) {
        const cartObj = localCart
          .getItems()
          .map(({ product_id, quantity }) =>
            cartService.addToCart(product_id, quantity)
          );
        await Promise.all(cartObj);
        localCart.clearCart();
        const response = await cartService.getCart();
        return response.data;
      } else {
        const items = localCart.getItems();
        return items ? { items: [...items] } : { items: [] };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to initialize cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (isLoggedIn) {
        const response = await cartService.addToCart(
          product.product_id,
          quantity
        );
        return response.data.data;
      } else {
        localCart.addItem(product, 1);
        return localCart.getItems();
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ product_id, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (isLoggedIn) {
        await cartService.removeFromCart(product_id);
        return product_id;
      } else {
        localCart.removeItem(product_id);
        return localCart.getItems();
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }
);

export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async ({ product_id, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (isLoggedIn) {
        const response = await cartService.increment(product_id);
        return response.data;
      } else {
        localCart.incrementQuantity(product_id);
        return localCart.getItems();
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to increment quantity"
      );
    }
  }
);

export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async ({ product_id, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (isLoggedIn) {
        const response = await cartService.decrement(product_id);
        return response.data;
      } else {
        localCart.decrementQuantity(product_id);
        return localCart.getItems();
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to decrement quantity"
      );
    }
  }
);
