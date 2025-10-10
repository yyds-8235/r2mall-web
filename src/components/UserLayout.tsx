import React from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown, Button } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
  ShoppingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearUserInfo } from '@/store/modules/user';
import { logout } from '@/apis/auth';

const { Header, Content } = Layout;

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { items } = useSelector((state: RootState) => state.cart);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      dispatch(clearUserInfo());
      navigate('/login');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
      onClick: () => navigate('/user/profile')
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  const menuItems = [
    {
      key: '/user/home',
      label: '首页',
      icon: <HomeOutlined />
    },
    {
      key: '/user/products',
      label: '商品列表',
      icon: <ShoppingOutlined />
    },
    {
      key: '/user/orders',
      label: '我的订单',
      icon: <ShoppingOutlined />
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '50px', color: '#1890ff' }}>
            乡村振兴电商云平台
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, border: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Badge count={items.length} offset={[0, 0]}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
              onClick={() => navigate('/user/cart')}
            />
          </Badge>
          {userInfo ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar src={userInfo.avatar} icon={<UserOutlined />} />
                <span style={{ marginLeft: '8px' }}>{(userInfo as any).username || (userInfo as any).shopName}</span>
              </div>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>登录</Button>
          )}
        </div>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default UserLayout;

