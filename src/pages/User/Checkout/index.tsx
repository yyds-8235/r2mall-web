import React, { useState, useEffect } from 'react';
import { Card, Radio, Button, message, Descriptions, List, Empty, Modal, Form, Input, Switch } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAddressList, updateAddress } from '@/apis/user';
import { createOrder } from '@/apis/order';
import { clearCart } from '@/store/modules/cart';
import type { ShippingAddress, CartItem } from '@/types';
import AddressModal from './AddressModal';

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = location.state?.items as CartItem[] || [];
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await getAddressList();
      setAddresses(res.data);
      // 默认选择默认地址
      const defaultAddress = res.data.find(addr => addr.isDefault === 1);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (res.data.length > 0) {
        setSelectedAddressId(res.data[0].id);
      }
    } catch (error) {
      console.error('获取地址列表失败:', error);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      message.warning('请选择收货地址');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        addressId: selectedAddressId
      };
      await createOrder(orderData);
      message.success('订单创建成功');
      dispatch(clearCart());
      navigate('/user/orders');
    } catch (error) {
      console.error('创建订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleEditAddress = (address: ShippingAddress) => {
    setEditingAddress(address);
    editForm.setFieldsValue({
      recipientName: address.recipientName,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault === 1
    });
    setEditModalVisible(true);
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;
    try {
      const values = await editForm.validateFields();
      const updateData = {
        ...values,
        isDefault: values.isDefault ? 1 : 0
      };
      await updateAddress(editingAddress.id, updateData);
      message.success('地址修改成功');
      setEditModalVisible(false);
      setEditingAddress(null);
      editForm.resetFields();
      fetchAddresses();
    } catch (error) {
      console.error('修改地址失败:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <Card>
            <Empty description="没有要结算的商品">
              <Button type="primary" onClick={() => navigate('/user/cart')}>
                返回购物车
              </Button>
            </Empty>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <Card title="选择收货地址" style={{ marginBottom: '16px' }}>
        {addresses.length > 0 ? (
          <Radio.Group
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
            style={{ width: '100%' }}
          >
            {addresses.map(address => (
              <Radio key={address.id} value={address.id} style={{ display: 'block', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <div>
                      <strong>{address.recipientName}</strong> {address.phone}
                      {address.isDefault === 1 && <span style={{ marginLeft: '8px', color: '#1890ff' }}>[默认]</span>}
                    </div>
                    <div style={{ color: '#999' }}>{address.address}</div>
                  </div>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address);
                    }}
                  >
                    编辑
                  </Button>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Empty description="暂无收货地址" />
        )}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setAddressModalVisible(true)}
          style={{ marginTop: '16px' }}
        >
          添加新地址
        </Button>
      </Card>

      <Card title="确认订单信息" style={{ marginBottom: '16px' }}>
        <List
          dataSource={items}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<img src={item.product.image || '/placeholder-image.jpg'} alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />}
                title={item.product.name}
                description={`¥${item.product.price} x ${item.quantity}`}
              />
              <div style={{ color: '#f5222d', fontWeight: 'bold' }}>
                ¥{(item.product.price * item.quantity).toFixed(2)}
              </div>
            </List.Item>
          )}
        />
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Descriptions column={1}>
            <Descriptions.Item label="商品总价">¥{totalPrice.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="运费">¥0.00</Descriptions.Item>
          </Descriptions>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '16px' }}>
              应付金额：<span style={{ fontSize: '24px', color: '#f5222d', fontWeight: 'bold' }}>¥{totalPrice.toFixed(2)}</span>
            </div>
            <Button type="primary" size="large" onClick={handleSubmitOrder} loading={loading}>
              提交订单
            </Button>
          </div>
        </div>
      </Card>

      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSuccess={() => {
          setAddressModalVisible(false);
          fetchAddresses();
        }}
      />

      <Modal
        title="编辑收货地址"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingAddress(null);
          editForm.resetFields();
        }}
        onOk={handleUpdateAddress}
        okText="确定"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
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
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
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
          <Form.Item
            name="isDefault"
            label="设为默认地址"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default Checkout;

