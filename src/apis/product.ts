import request from '@/utils/request';
import type { Product, PageRequest, PageResponse, ApiResponse } from '@/types';

// ========== 商品浏览（用户端，无需登录） ==========

// 浏览/搜索商品
export const getProductList = (params: PageRequest) => {
  return request.get<any, ApiResponse<PageResponse<Product>>>('/user/products', { params });
};

// 获取商品详情
export const getProductDetail = (id: number) => {
  return request.get<any, ApiResponse<Product>>(`/user/products/${id}`);
};

