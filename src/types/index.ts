// 用户信息类型
export interface User {
  id: number;
  username: string;
  avatar?: string;
  gender: 0 | 1 | 2; // 0: 未知, 1: 男, 2: 女
  dateOfBirth?: string;
  createTime?: string;
  updateTime?: string;
}

// 商家信息类型
export interface Merchant {
  id: number;
  merchantNo: string;
  shopName: string;
  avatar?: string;
  createTime?: string;
  updateTime?: string;
}

// 商品类型
export interface Product {
  id: number;
  merchantId: number;
  name: string;
  image: string;
  price: number;
  stock: number;
  description?: string;
  status: 0 | 1; // 0: 下架, 1: 上架
  createTime?: string;
  updateTime?: string;
}

// 收货地址类型
export interface ShippingAddress {
  id: number;
  userId: number;
  recipientName: string;
  phone: string;
  address: string;
  isDefault: 0 | 1; // 0: 否, 1: 是
  createTime?: string;
  updateTime?: string;
}

// 订单类型
export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  totalAmount: number;
  shippingAddress: string;
  status: 0 | 1; // 0: 待支付, 1: 已支付/待发货
  deliveryTime?: string;
  createTime?: string;
  paymentTime?: string;
  items?: OrderItem[];
}

// 订单商品类型
export interface OrderItem {
  id: number;
  orderNo: string;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

// 聊天消息类型
export interface ChatMessage {
  fromUserId: string;
  toUserId: string;
  messageType: 'text';
  content: string;
  timestamp: number;
}

// 登录请求
export interface LoginRequest {
  loginId: string;
  password: string;
  role: 'user' | 'merchant';
}

// 用户注册请求
export interface UserRegisterRequest {
  username: string;
  password: string;
}

// 商家注册请求
export interface MerchantRegisterRequest {
  merchantNo: string;
  password: string;
  shopName: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页请求
export interface PageRequest {
  page?: number;
  size?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PageResponse<T> {
  /** 当前页的记录列表 */
  records: T[];
  /** 总记录数 */
  total: number;
  /** 每页显示的记录数 */
  size: number;
  /** 当前页码 */
  current: number;
  /** 总页数 */
  pages: number;
}

// 购物车商品类型
export interface CartItem {
  product: Product;
  quantity: number;
}

