import request from '@/utils/request';
import type { Merchant, Product, ApiResponse } from '@/types';

// ========== 商家中心 ==========

// 获取商家信息
export const getMerchantProfile = () => {
  return request.get<any, ApiResponse<Merchant>>('/merchant/profile');
};

// 修改店铺信息
export const updateMerchantProfile = (data: Partial<Merchant>) => {
  return request.put<any, ApiResponse<Merchant>>('/merchant/profile', data);
};

// 修改密码
export const updateMerchantPassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.put<any, ApiResponse>('/merchant/password', data);
};

// 注销账户
export const deleteMerchantAccount = () => {
  return request.delete<any, ApiResponse>('/merchant/account');
};

// ========== 商品管理 ==========

// 获取我的商品
export const getMerchantProducts = () => {
  return request.get<any, ApiResponse<Product[]>>('/merchant/products');
};

// 上架新商品
export const addProduct = (data: Omit<Product, 'id' | 'merchantId' | 'createTime' | 'updateTime'>) => {
  return request.post<any, ApiResponse<Product>>('/merchant/products', data);
};

// 编辑商品
export const updateProduct = (id: number, data: Partial<Product>) => {
  return request.put<any, ApiResponse<Product>>(`/merchant/products/${id}`, data);
};

// 上下架商品
export const updateProductStatus = (id: number, status: 0 | 1) => {
  return request.put<any, ApiResponse>(`/merchant/products/${id}/status`, { status });
};

