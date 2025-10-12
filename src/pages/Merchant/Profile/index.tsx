import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Modal } from 'antd';
import { UploadOutlined, ShopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getMerchantProfile, updateMerchantProfile, updateMerchantPassword, deleteMerchantAccount } from '@/apis/merchant';
import { uploadFile } from '@/apis/file'; // 导入文件上传API
import { updateUserInfo, clearUserInfo } from '@/store/modules/user';
import { useNavigate } from 'react-router-dom';

const MerchantProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(''); // 用于存储头像URL

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMerchantProfile();
      form.setFieldsValue(res.data);
      if (res.data.avatar) {
        setAvatarUrl(res.data.avatar);
      }
    } catch (error) {
      console.error('获取商家信息失败:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const updateData = {
        ...values,
        avatar: avatarUrl // 确保在更新时包含头像URL
      };
      
      // 创建要更新的商家信息对象，只包含可能被修改的字段
      const modifiedMerchantData = {
        avatar: updateData.avatar,
        shopName: updateData.shopName
      };
      
      // 调用API更新后端数据
      const res = await updateMerchantProfile(updateData);
      
      if (res.code === 200) {
        // 只将修改的数据更新到Redux store，而不使用后端返回的数据
        dispatch(updateUserInfo(modifiedMerchantData));
        message.success('店铺信息更新成功');
      }
    } catch (error) {
      console.error('更新店铺信息失败:', error);
      message.error('更新店铺信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 图片上传前的处理函数
  const handleBeforeUpload = async (file: File) => {
    try {
      // 调用文件上传API
      const res = await uploadFile(file);
      // 设置头像URL
      setAvatarUrl(res.data);
      // 更新表单中的头像字段值
      form.setFieldValue('avatar', res.data);
      message.success('头像上传成功');
    } catch (error) {
      console.error('头像上传失败:', error);
      message.error('头像上传失败');
    }
    return false; // 阻止默认上传行为，因为我们已经手动处理了上传
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
              beforeUpload={handleBeforeUpload}
              fileList={avatarUrl ? [{ uid: '1', name: 'avatar.jpg', status: 'done', url: avatarUrl }] : []}
              onRemove={() => {
                setAvatarUrl('');
                form.setFieldValue('avatar', '');
                return true;
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

