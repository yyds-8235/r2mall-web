import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Modal } from 'antd';
import { UploadOutlined, ShopOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { getMerchantProfile, updateMerchantProfile, updateMerchantPassword, deleteMerchantAccount } from '@/apis/merchant';
import { updateUserInfo, clearUserInfo } from '@/store/modules/user';
import { useNavigate } from 'react-router-dom';

const MerchantProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMerchantProfile();
      form.setFieldsValue(res.data);
    } catch (error) {
      console.error('获取商家信息失败:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await updateMerchantProfile(values);
      dispatch(updateUserInfo(res.data));
      message.success('店铺信息更新成功');
    } catch (error) {
      console.error('更新店铺信息失败:', error);
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
      await updateMerchantPassword({
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
          await deleteMerchantAccount();
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
      <Card title="店铺信息" extra={<Button onClick={() => setPasswordModalVisible(true)}>修改密码</Button>}>
        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item name="avatar" label="店铺头像">
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
          <Form.Item name="merchantNo" label="商家号">
            <Input disabled prefix={<ShopOutlined />} />
          </Form.Item>
          <Form.Item
            name="shopName"
            label="店铺名称"
            rules={[{ required: true, message: '请输入店铺名称' }]}
          >
            <Input prefix={<ShopOutlined />} />
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

export default MerchantProfile;

