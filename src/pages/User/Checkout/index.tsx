import React, { useState, useEffect } from 'react';
import { Card, Radio, Button, message, Descriptions, List, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAddressList } from '@/apis/user';
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
  const [loading, setLoading] = useState(false);

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
      const res = await createOrder(orderData);
      message.success('订单创建成功');
      dispatch(clearCart());
      navigate(`/user/orders/${res.data.orderNo}`);
    } catch (error) {
      console.error('创建订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card>
        <Empty description="没有要结算的商品">
          <Button type="primary" onClick={() => navigate('/user/cart')}>
            返回购物车
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      <Card title="选择收货地址" style={{ marginBottom: '16px' }}>
        {addresses.length > 0 ? (
          <Radio.Group
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
            style={{ width: '100%' }}
          >
            {addresses.map(address => (
              <Radio key={address.id} value={address.id} style={{ display: 'block', marginBottom: '16px' }}>
                <div>
                  <strong>{address.recipientName}</strong> {address.phone}
                  {address.isDefault === 1 && <span style={{ marginLeft: '8px', color: '#1890ff' }}>[默认]</span>}
                </div>
                <div style={{ color: '#999' }}>{address.address}</div>
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
                avatar={<img src={item.product.image} alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />}
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
    </div>
  );
};

export default Checkout;

