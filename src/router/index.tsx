import { createBrowserRouter, Navigate } from 'react-router-dom';

// 布局组件
import UserLayout from '@/components/UserLayout';
import MerchantLayout from '@/components/MerchantLayout';

// 登录页
import Login from '@/pages/Login';

// 用户端页面
import UserHome from '@/pages/User/Home';
import ProductList from '@/pages/User/ProductList';
import ProductDetail from '@/pages/User/ProductDetail';
import Cart from '@/pages/User/Cart';
import Checkout from '@/pages/User/Checkout';
import Orders from '@/pages/User/Orders';
import OrderDetail from '@/pages/User/OrderDetail';
import UserProfile from '@/pages/User/Profile';

// 商家端页面
import MerchantDashboard from '@/pages/Merchant/Dashboard';
import MerchantProducts from '@/pages/Merchant/Products';
import MerchantProfile from '@/pages/Merchant/Profile';
import MerchantMessages from '@/pages/Merchant/Messages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/user/home" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/user/home" replace />
      },
      {
        path: 'home',
        element: <UserHome />
      },
      {
        path: 'products',
        element: <ProductList />
      },
      {
        path: 'products/:id',
        element: <ProductDetail />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'orders',
        element: <Orders />
      },
      {
        path: 'orders/:orderNo',
        element: <OrderDetail />
      },
      {
        path: 'profile',
        element: <UserProfile />
      }
    ]
  },
  {
    path: '/merchant',
    element: <MerchantLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/merchant/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <MerchantDashboard />
      },
      {
        path: 'products',
        element: <MerchantProducts />
      },
      {
        path: 'profile',
        element: <MerchantProfile />
      },
      {
        path: 'messages',
        element: <MerchantMessages />
      }
    ]
  }
]);
