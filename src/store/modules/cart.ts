import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          product: action.payload.product,
          quantity: action.payload.quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.items.find(item => item.product.id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    }
  }
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

