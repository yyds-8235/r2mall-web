import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  UserOutlined,
  LogoutOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearUserInfo } from '@/store/modules/user';
import { logout } from '@/apis/auth';

const { Header, Sider, Content } = Layout;

const MerchantLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

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
      label: '店铺设置',
      icon: <UserOutlined />,
      onClick: () => navigate('/merchant/profile')
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  const siderMenuItems = [
    {
      key: '/merchant/dashboard',
      label: '控制台',
      icon: <DashboardOutlined />
    },
    {
      key: '/merchant/products',
      label: '商品管理',
      icon: <ShoppingOutlined />
    },
    {
      key: '/merchant/messages',
      label: '客服消息',
      icon: <MessageOutlined />
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#001529', color: '#fff' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          商家管理后台
        </div>
        {userInfo && (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar src={userInfo.avatar} icon={<UserOutlined />} />
              <span style={{ marginLeft: '8px', color: '#fff' }}>{(userInfo as any).shopName}</span>
            </div>
          </Dropdown>
        )}
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={siderMenuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: '8px'
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MerchantLayout;

