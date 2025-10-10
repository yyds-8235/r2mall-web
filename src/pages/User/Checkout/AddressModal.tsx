import React from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { addAddress } from '@/apis/user';

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await addAddress({
        recipientName: values.recipientName,
        phone: values.phone,
        address: values.address,
        isDefault: values.isDefault ? 1 : 0
      });
      message.success('地址添加成功');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('添加地址失败:', error);
    }
  };

  return (
    <Modal
      title="添加收货地址"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="recipientName"
          label="收货人姓名"
          rules={[{ required: true, message: '请输入收货人姓名' }]}
        >
          <Input placeholder="请输入收货人姓名" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="联系电话"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
          ]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item
          name="address"
          label="详细地址"
          rules={[{ required: true, message: '请输入详细地址' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入详细地址" />
        </Form.Item>
        <Form.Item name="isDefault" label="设为默认地址" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressModal;

