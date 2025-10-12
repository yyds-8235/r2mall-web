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

// ========== 聊天消息 ==========

// 聊天消息接口
export interface ChatMessage {
  fromUserId: string;
  toUserId: string;
  messageType: 'text';
  content: string;
  timestamp: number;
}

// 获取聊天历史记录
export const getChatHistory = (toUserId: string, page: number = 1, size: number = 50) => {
  return request.get<any, ApiResponse<{
    records: ChatMessage[];
    total: number;
    current: number;
    size: number;
  }>>(`/user/chat/history/${toUserId}`, {
    params: { page, size }
  });
};

// 获取所有聊天会话列表（商家端）
export const getChatSessions = () => {
  return request.get<any, ApiResponse<{
    userId: number;
    userName: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    totalMessages: number;
  }[]>>('/merchant/chat/sessions');
};

// 发送聊天消息
export const sendChatMessage = (data: {
  toUserId: string;
  messageType: 'text';
  content: string;
}) => {
  return request.post<any, ApiResponse<ChatMessage>>('/user/chat/send', data);
};

// ========== 商家统计 ==========

// 商家统计数据接口
export interface MerchantStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  totalConsultations: number;
}

// 商品类型销售统计接口
export interface CategorySalesData {
  category: string;
  count: number;
  sales: number;
}

// 获取商家统计数据
export const getMerchantStats = () => {
  return request.get<any, ApiResponse<MerchantStats>>('/merchant/stats');
};

// 获取商品类型销售统计
export const getCategorySalesStats = () => {
  return request.get<any, ApiResponse<CategorySalesData[]>>('/merchant/stats/category-sales');
};