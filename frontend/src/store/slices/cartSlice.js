import { createSlice } from "@reduxjs/toolkit";
import {
  initializeCart,
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../methods/cartMethod";

const initialState = {
  cartData: null,
  cartSubtotal: 0,
  cartTotal: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.cartData = null;
      state.cartSubtotal = 0;
      state.cartTotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Cart
      .addCase(initializeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartData = action.payload;
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartData = { items: action.payload };
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cartData?.items) {
          // Simply filter out the removed item
          state.cartData.items = state.cartData.items.filter(
            (item) => item.product_id !== action.payload
          );
        }
        // Update subtotal and total after removing item
        const items = state.cartData?.items || [];
        state.cartSubtotal = Array.isArray(items) ? items.reduce((acc, cur) => acc + Number(cur.subtotal || 0), 0) : 0;
        state.cartTotal = Array.isArray(items) ? items.reduce((acc, cur) => acc + Number(cur.quantity || 0), 0) : 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Increment Quantity
      .addCase(incrementQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cartData?.items) {
          // Update quantities while maintaining order
          const updatedItems = state.cartData.items.map(item => {
            const updatedItem = action.payload.find(p => p.product_id === item.product_id);
            return updatedItem || item;
          });
          state.cartData.items = updatedItems;
        }
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Decrement Quantity
      .addCase(decrementQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cartData?.items) {
          // Update quantities while maintaining order
          const updatedItems = state.cartData.items.map(item => {
            const updatedItem = action.payload.find(p => p.product_id === item.product_id);
            return updatedItem || item;
          });
          state.cartData.items = updatedItems;
        }
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCartData = (state) => state.cartReducer.cartData;
export const selectCartSubtotal = (state) => {
  const items = state.cartReducer.cartData?.items || [];
  if (!Array.isArray(items)) return 0;
  return Math.ceil(items.reduce((acc, cur) => acc + Number(cur.subtotal || 0), 0));
};
export const selectCartTotal = (state) => {
  const items = state.cartReducer.cartData?.items || [];
  if (!Array.isArray(items)) return 0;
  return Math.ceil(items.reduce((acc, cur) => acc + Number(cur.quantity || 0), 0));
};
export const selectCartLoading = (state) => state.cartReducer.loading;
export const selectCartError = (state) => state.cartReducer.error;

export const { clearError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
