import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Upload, message, Modal } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getUserProfile, updateUserProfile, updatePassword, deleteAccount } from '@/apis/user';
import { updateUserInfo, clearUserInfo } from '@/store/modules/user';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      form.setFieldsValue({
        ...res.data,
        dateOfBirth: res.data.dateOfBirth ? dayjs(res.data.dateOfBirth) : null
      });
    } catch (error) {
      console.error('获取个人信息失败:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const updateData = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
      };
      const res = await updateUserProfile(updateData);
      dispatch(updateUserInfo(res.data));
      message.success('个人信息更新成功');
    } catch (error) {
      console.error('更新个人信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次密码输入不一致');
        return;
      }
      await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      message.success('密码修改成功，请重新登录');
      setPasswordModalVisible(false);
      dispatch(clearUserInfo());
      navigate('/login');
    } catch (error) {
      console.error('修改密码失败:', error);
    }
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: '确认注销账户',
      content: '注销账户后，所有数据将被删除且无法恢复，确定要继续吗？',
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteAccount();
          message.success('账户已注销');
          dispatch(clearUserInfo());
          navigate('/login');
        } catch (error) {
          console.error('注销账户失败:', error);
        }
      }
    });
  };

  return (
    <div>
      <Card title="个人信息" extra={<Button onClick={() => setPasswordModalVisible(true)}>修改密码</Button>}>
        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item name="avatar" label="头像">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => {
                message.info('头像上传功能需要配置文件服务器');
                return false;
              }}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传头像</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item name="username" label="用户名">
            <Input disabled prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select>
              <Option value={0}>未知</Option>
              <Option value={1}>男</Option>
              <Option value={2}>女</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateOfBirth" label="出生日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
            <Button danger onClick={handleDeleteAccount} style={{ marginLeft: '16px' }}>
              注销账户
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={handleUpdatePassword}
        okText="确定"
        cancelText="取消"
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[{ required: true, message: '请确认新密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;

