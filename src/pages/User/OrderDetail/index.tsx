import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Table, Tag, Button, Steps, Modal, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetail, updateOrderStatus } from '@/apis/order';
import type { Order, OrderItem } from '@/types';

const OrderDetail: React.FC = () => {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
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
      setOrder(res.data.orderInfo);
      setOrderItems(res.data.items);
    } catch (error) {
      console.error('获取订单详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!orderNo) return;
    navigate(`/user/payment/${orderNo}`);
  };

  const handleConfirmReceipt = () => {
    if (!orderNo) return;
    Modal.confirm({
      title: '确认收货',
      content: '确认已收到商品？收货后订单将标记为已完成。',
      okText: '确认收货',
      cancelText: '取消',
      onOk: async () => {
        try {
          await updateOrderStatus(orderNo, 3);
          message.success('确认收货成功');
          fetchOrderDetail();
        } catch (error) {
          console.error('确认收货失败:', error);
          message.error('确认收货失败');
        }
      }
    });
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
    return (
      <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <Card loading={loading}>订单不存在</Card>
        </div>
      </div>
    );
  }

  const getCurrentStep = () => {
    switch (order.status) {
      case 0: return 1; // 待支付
      case 1: return 2; // 已支付
      case 2: return 3; // 待收货
      case 3: return 4; // 已完成
      default: return 0;
    }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <Card style={{ marginBottom: '16px' }}>
        <Steps
          current={getCurrentStep()}
          items={[
            { title: '提交订单', description: order.createTime },
            { title: '支付订单', description: order.paymentTime },
            { title: '等待发货', description: order.deliveryTime },
            { title: '确认收货' }
          ]}
        />
      </Card>

      <Card title="订单信息" style={{ marginBottom: '16px' }}>
        <Descriptions column={2}>
          <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
          <Descriptions.Item label="订单状态">
            {(() => {
              const statusMap = {
                0: { text: '待支付', color: 'orange' },
                1: { text: '已支付', color: 'blue' },
                2: { text: '待收货', color: 'purple' },
                3: { text: '已完成', color: 'green' }
              };
              const statusInfo = statusMap[order.status as keyof typeof statusMap] || statusMap[0];
              return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            })()}
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
          dataSource={orderItems}
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

      {order.status === 2 && (
        <Card>
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" size="large" onClick={handleConfirmReceipt}>
              确认收货
            </Button>
          </div>
        </Card>
      )}

      <Button onClick={() => navigate('/user/orders')} style={{ marginTop: '16px' }}>
        返回订单列表
      </Button>
      </div>
    </div>
  );
};

export default OrderDetail;

