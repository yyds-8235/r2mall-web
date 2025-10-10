import { configureStore } from '@reduxjs/toolkit';
import userReducer from './modules/user';
import cartReducer from './modules/cart';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
