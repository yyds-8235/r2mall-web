import request from '@/utils/request';
import type { User, ShippingAddress, ApiResponse } from '@/types';

// ========== 个人中心 ==========

// 获取个人信息
export const getUserProfile = () => {
  return request.get<any, ApiResponse<User>>('/user/profile');
};

// 修改个人信息
export const updateUserProfile = (data: Partial<User>) => {
  return request.put<any, ApiResponse<User>>('/user/profile', data);
};

// 修改密码
export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.put<any, ApiResponse>('/user/password', data);
};

// 注销账户
export const deleteAccount = () => {
  return request.delete<any, ApiResponse>('/user/account');
};

// ========== 收货地址 ==========

// 获取地址列表
export const getAddressList = () => {
  return request.get<any, ApiResponse<ShippingAddress[]>>('/user/addresses');
};

// 新增地址
export const addAddress = (data: Omit<ShippingAddress, 'id' | 'userId' | 'createTime' | 'updateTime'>) => {
  return request.post<any, ApiResponse<ShippingAddress>>('/user/addresses', data);
};

// 修改地址
export const updateAddress = (id: number, data: Partial<ShippingAddress>) => {
  return request.put<any, ApiResponse<ShippingAddress>>(`/user/addresses/${id}`, data);
};

// 删除地址
export const deleteAddress = (id: number) => {
  return request.delete<any, ApiResponse>(`/user/addresses/${id}`);
};
