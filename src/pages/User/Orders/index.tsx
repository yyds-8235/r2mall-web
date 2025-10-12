import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getOrderList, updateOrderStatus } from '@/apis/order';
import type { Order } from '@/types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrderList();
      setOrders(res.data.records);
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = (orderNo: string) => {
    navigate(`/user/payment/${orderNo}`);
  };

  const handleConfirmReceipt = (orderNo: string) => {
    Modal.confirm({
      title: '确认收货',
      content: '确认已收到商品？请确认无误后操作。',
      okText: '确认收货',
      cancelText: '取消',
      onOk: async () => {
        try {
          await updateOrderStatus(orderNo, 3);
          message.success('确认收货成功');
          fetchOrders();
        } catch (error) {
          console.error('确认收货失败:', error);
          message.error('确认收货失败');
        }
      }
    });
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{amount}</span>
    },
    {
      title: '收货地址',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress'
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap = {
          0: { text: '待支付', color: 'orange' },
          1: { text: '已支付', color: 'blue' },
          2: { text: '待收货', color: 'purple' },
          3: { text: '已完成', color: 'green' }
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap[0];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Order) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="link"
            onClick={() => navigate(`/user/orders/${record.orderNo}`)}
          >
            查看详情
          </Button>
          {record.status === 0 && (
            <Button
              type="link"
              onClick={() => handlePay(record.orderNo)}
            >
              去支付
            </Button>
          )}
          {record.status === 2 && (
            <Button
              type="link"
              onClick={() => handleConfirmReceipt(record.orderNo)}
            >
              确认收货
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <Card title="我的订单">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="orderNo"
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
};

export default Orders;

