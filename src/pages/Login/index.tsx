import React, { useState } from 'react';
import { Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined, SwapOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, userRegister, merchantRegister } from '@/apis/auth';
import { setUserInfo } from '@/store/modules/user';
import type { LoginRequest, UserRegisterRequest, MerchantRegisterRequest } from '@/types';
import './style.css';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState('userLogin');
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false); // 控制翻转状态
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUserLogin = async (values: any) => {
    setLoading(true);
    try {
      const loginData: LoginRequest = {
        loginId: values.username,
        password: values.password,
        role: 'user'
      };
      const res = await login(loginData);
      dispatch(setUserInfo({
        userInfo: res.data.userInfo,
        token: res.data.token,
        role: 'user'
      }));
      message.success('登录成功');
      navigate('/user/home');
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantLogin = async (values: any) => {
    setLoading(true);
    try {
      const loginData: LoginRequest = {
        loginId: values.merchantNo,
        password: values.password,
        role: 'merchant'
      };
      const res = await login(loginData);
      dispatch(setUserInfo({
        userInfo: res.data.userInfo,
        token: res.data.token,
        role: 'merchant'
      }));
      message.success('登录成功');
      navigate('/merchant/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegister = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }
    setLoading(true);
    try {
      const registerData: UserRegisterRequest = {
        username: values.username,
        password: values.password
      };
      await userRegister(registerData);
      message.success('注册成功，请登录');
      setActiveTab('userLogin');
    } catch (error) {
      console.error('注册失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantRegister = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }
    setLoading(true);
    try {
      const registerData: MerchantRegisterRequest = {
        merchantNo: values.merchantNo,
        password: values.password,
        shopName: values.shopName
      };
      await merchantRegister(registerData);
      message.success('入驻成功，请登录');
      setActiveTab('merchantLogin');
    } catch (error) {
      console.error('入驻失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setActiveTab(isFlipped ? 'userLogin' : 'merchantLogin');
  };

  const userTabItems = [
    {
      key: 'userLogin',
      label: '用户登录',
      children: (
        <Form onFinish={handleUserLogin} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'userRegister',
      label: '用户注册',
      children: (
        <Form onFinish={handleUserRegister} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: '请确认密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              注册
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  const merchantTabItems = [
    {
      key: 'merchantLogin',
      label: '商家登录',
      children: (
        <Form onFinish={handleMerchantLogin} autoComplete="off">
          <Form.Item name="merchantNo" rules={[{ required: true, message: '请输入商家号' }]}>
            <Input prefix={<ShopOutlined />} placeholder="商家号" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'merchantRegister',
      label: '商家入驻',
      children: (
        <Form onFinish={handleMerchantRegister} autoComplete="off">
          <Form.Item name="merchantNo" rules={[{ required: true, message: '请输入商家号' }]}>
            <Input prefix={<ShopOutlined />} placeholder="商家号" size="large" />
          </Form.Item>
          <Form.Item name="shopName" rules={[{ required: true, message: '请输入店铺名称' }]}>
            <Input prefix={<ShopOutlined />} placeholder="店铺名称" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: '请确认密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              入驻
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <div className="login-container">
      <div className="login-title">乡村振兴电商云平台</div>

      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        {/* 用户端 - 正面 */}
        <div className="flip-card-front">
          <div className="card-header">
            <UserOutlined className="card-icon" />
            <h2>用户端</h2>
          </div>
          <div className="card-content">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={userTabItems}
              centered
            />
          </div>
          <div className="flip-trigger" onClick={handleFlip}>
            <SwapOutlined />
            <span>切换到商家端</span>
          </div>
        </div>

        {/* 商家端 - 背面 */}
        <div className="flip-card-back">
          <div className="card-header merchant">
            <ShopOutlined className="card-icon" />
            <h2>商家端</h2>
          </div>
          <div className="card-content">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={merchantTabItems}
              centered
            />
          </div>
          <div className="flip-trigger" onClick={handleFlip}>
            <SwapOutlined />
            <span>切换到用户端</span>
          </div>
        </div>
      </div>

      <div className="login-footer">
        <div className="footer-tip">
          {isFlipped ? '商家入驻，开启您的线上店铺' : '连接乡村与城市，助力乡村振兴'}
        </div>
      </div>
    </div>
  );
};

export default Login;

