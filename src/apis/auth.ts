import request from '@/utils/request';
import type { LoginRequest, UserRegisterRequest, MerchantRegisterRequest, User, Merchant, ApiResponse } from '@/types';

// 统一登录
export const login = (data: LoginRequest) => {
  return request.post<any, ApiResponse<{ token: string; userInfo: User | Merchant }>>('/auth/login', data);
};

// 用户注册
export const userRegister = (data: UserRegisterRequest) => {
  return request.post<any, ApiResponse<User>>('/auth/user/register', data);
};

// 商家入驻
export const merchantRegister = (data: MerchantRegisterRequest) => {
  return request.post<any, ApiResponse<Merchant>>('/auth/merchant/register', data);
};

// 注销登录
export const logout = () => {
  return request.post<any, ApiResponse>('/auth/logout');
};

