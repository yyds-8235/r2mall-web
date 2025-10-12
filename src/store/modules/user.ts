import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, Merchant } from '@/types';

interface UserState {
  userInfo: User | Merchant | null;
  token: string | null;
  role: 'user' | 'merchant' | null;
}

const initialState: UserState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') as 'user' | 'merchant' | null || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ userInfo: User | Merchant; token: string; role: 'user' | 'merchant' }>) => {
      
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      state.role = action.payload.role;
      
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.token = null;
      state.role = null;
      
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
    updateUserInfo: (state, action: PayloadAction<Partial<User | Merchant>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    }
  }
});

export const { setUserInfo, clearUserInfo, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
