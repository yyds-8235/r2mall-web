import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Table, Tag, Button, message, Steps } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, payOrder } from '@/apis/order';
import type { Order, OrderItem } from '@/types';

const OrderDetail: React.FC = () => {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderNo) {
      fetchOrderDetail();
    }
  }, [orderNo]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const res = await getOrderDetail(orderNo!);
      setOrder(res.data);
    } catch (error) {
      console.error('获取订单详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!orderNo) return;
    try {
      await payOrder(orderNo);
      message.success('支付成功');
      fetchOrderDetail();
    } catch (error) {
      console.error('支付失败:', error);
    }
  };

  const columns = [
    {
      title: '商品',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string, record: OrderItem) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={record.productImage} alt={name} style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 12 }} />
          <span>{name}</span>
        </div>
      )
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span>¥{price}</span>
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (record: OrderItem) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{(record.price * record.quantity).toFixed(2)}
        </span>
      )
    }
  ];

  if (!order) {
    return <Card loading={loading}>订单不存在</Card>;
  }

  const currentStep = order.status === 0 ? 0 : 1;

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <Steps
          current={currentStep}
          items={[
            { title: '提交订单', description: order.createTime },
            { title: '支付订单', description: order.paymentTime },
            { title: '等待发货' },
            { title: '确认收货' }
          ]}
        />
      </Card>

      <Card title="订单信息" style={{ marginBottom: '16px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
          <Descriptions.Item label="订单状态">
            <Tag color={order.status === 0 ? 'orange' : 'green'}>
              {order.status === 0 ? '待支付' : '已支付'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="收货地址">{order.shippingAddress}</Descriptions.Item>
          <Descriptions.Item label="订单金额">
            <span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{order.totalAmount}</span>
          </Descriptions.Item>
          <Descriptions.Item label="下单时间">{order.createTime}</Descriptions.Item>
          {order.paymentTime && (
            <Descriptions.Item label="支付时间">{order.paymentTime}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="商品清单" style={{ marginBottom: '16px' }}>
        <Table
          columns={columns}
          dataSource={order.items}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {order.status === 0 && (
        <Card>
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" size="large" onClick={handlePay}>
              立即支付
            </Button>
          </div>
        </Card>
      )}

      <Button onClick={() => navigate('/user/orders')} style={{ marginTop: '16px' }}>
        返回订单列表
      </Button>
    </div>
  );
};

export default OrderDetail;

