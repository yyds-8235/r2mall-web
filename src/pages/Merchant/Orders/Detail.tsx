import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Table, Tag, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getMerchantOrderDetail, shipMerchantOrder } from '@/apis/merchant';

const MerchantOrderDetail: React.FC = () => {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);

  const fetchDetail = async () => {
    if (!orderNo) return;
    setLoading(true);
    try {
      const res = await getMerchantOrderDetail(orderNo);
      setDetail(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [orderNo]);

  if (!detail) {
    return <Card loading={loading}>订单不存在</Card>;
  }

  const { orderInfo, items } = detail;

  const columns = [
    { title: '商品', dataIndex: 'productName', key: 'productName' },
    { title: '单价', dataIndex: 'price', key: 'price', render: (v: number) => `¥${v}` },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '小计', key: 'subtotal', render: (r: any) => <span style={{ color: '#f5222d', fontWeight: 600 }}>¥{(r.price * r.quantity).toFixed(2)}</span> }
  ];

  const handleShip = async () => {
    if (orderInfo.status !== 1) {
      message.info('仅待发货订单可以发货');
      return;
    }
    try {
      await shipMerchantOrder(orderNo!);
      message.success('发货成功');
      fetchDetail();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>返回</Button>
      <Card title="订单信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="订单号">{orderInfo.orderNo}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={orderInfo.status === 0 ? 'orange' : orderInfo.status === 1 ? 'blue' : 'green'}>
              {orderInfo.status === 0 ? '待支付' : orderInfo.status === 1 ? '待发货' : '已发货'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="收货地址">{orderInfo.shippingAddress}</Descriptions.Item>
          <Descriptions.Item label="金额"><span style={{ color: '#f5222d', fontWeight: 600 }}>¥{orderInfo.totalAmount}</span></Descriptions.Item>
          <Descriptions.Item label="下单时间">{orderInfo.createTime}</Descriptions.Item>
          {orderInfo.deliveryTime && (
            <Descriptions.Item label="发货时间">{orderInfo.deliveryTime}</Descriptions.Item>
          )}
        </Descriptions>
        {orderInfo.status === 1 && (
          <Button type="primary" onClick={handleShip}>发货</Button>
        )}
      </Card>

      <Card title="商品清单">
        <Table columns={columns} dataSource={items} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default MerchantOrderDetail;


