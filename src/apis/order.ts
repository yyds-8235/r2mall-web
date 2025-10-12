import request from '@/utils/request';
import type { Order, OrderDetail, ApiResponse, PageResponse } from '@/types';

// 创建订单
export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  addressId: number;
}

export const createOrder = (data: CreateOrderRequest) => {
  return request.post<any, ApiResponse<Order>>('/user/orders/create', data);
};

// 模拟支付
export const payOrder = (orderNo: string) => {
  return request.post<any, ApiResponse>(`/user/orders/${orderNo}/pay`);
};

// 查看订单列表
export const getOrderList = () => {
  return request.get<any, ApiResponse<PageResponse<Order>>>('/user/orders');
};

// 查看订单详情
export const getOrderDetail = (orderNo: string) => {
  return request.get<any, ApiResponse<OrderDetail>>(`/user/orders/${orderNo}`);
};

// 更新订单状态
export const updateOrderStatus = (orderNo: string, status: number) => {
  return request.put<any, ApiResponse>(`/user/orders/${orderNo}/status`, { status });
};

