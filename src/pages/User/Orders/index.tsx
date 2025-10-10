import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getOrderList, payOrder } from '@/apis/order';
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

  const handlePay = async (orderNo: string) => {
    try {
      await payOrder(orderNo);
      message.success('支付成功');
      fetchOrders();
    } catch (error) {
      console.error('支付失败:', error);
    }
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
      render: (status: number) => (
        <Tag color={status === 0 ? 'orange' : 'green'}>
          {status === 0 ? '待支付' : '已支付'}
        </Tag>
      )
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
        </div>
      )
    }
  ];

  return (
    <Card title="我的订单">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderNo"
        loading={loading}
      />
    </Card>
  );
};

export default Orders;

