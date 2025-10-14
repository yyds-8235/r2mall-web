import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMerchantOrders, shipMerchantOrder, updateMerchantOrderAddress } from '@/apis/merchant';
import type { MerchantOrderInfo } from '@/apis/merchant';

const MerchantOrders: React.FC = () => {
  const [orders, setOrders] = useState<MerchantOrderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [currentOrderNo, setCurrentOrderNo] = useState<string | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMerchantOrders({ page, size });
      setOrders(res.data.records as any);
      setTotal(res.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, size]);

  const handleShip = async (orderNo: string) => {
    try {
      await shipMerchantOrder(orderNo);
      message.success('发货成功');
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const openAddressModal = (orderNo: string) => {
    setCurrentOrderNo(orderNo);
    setAddressModalVisible(true);
  };

  const handleUpdateAddress = async () => {
    if (!currentOrderNo) return;
    try {
      const values = await form.validateFields();
      await updateMerchantOrderAddress(currentOrderNo, values.shippingAddress);
      message.success('地址修改成功');
      setAddressModalVisible(false);
      form.resetFields();
      fetchOrders();
    } catch (e) {
      // 已有校验提示
    }
  };

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center' as const},
    { title: '金额', dataIndex: 'totalAmount', key: 'totalAmount', align: 'center' as const, render: (v: number) => <span style={{ color: '#f5222d', fontWeight: 600 }}>¥{v}</span> },
    { title: '地址', dataIndex: 'shippingAddress', align: 'center' as const, key: 'shippingAddress' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      align: 'center' as const, 
      render: (s: number) => {
          // 增加对状态 3 (已完成) 的处理
          let color: string;
          let text: string;
  
          switch (s) {
              case 0:
                  color = 'orange';
                  text = '待支付';
                  break;
              case 1:
                  color = 'purple';
                  text = '待发货';
                  break;
              case 2:
                  color = 'blue';
                  text = '已发货';
                  break;
              case 3: 
                  color = 'green'; 
                  text = '已完成';
                  break;
              default:
                  color = 'default';
                  text = '未知状态';
                  break;
          }
  
          return <Tag color={color}>{text}</Tag>;
      } 
  },
    { title: '下单时间', dataIndex: 'createTime', key: 'createTime', align: 'center' as const },
    {
      title: '操作', key: 'action', align: 'center' as const, render: (record: MerchantOrderInfo) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="link" onClick={() => navigate(`/merchant/orders/${record.orderNo}`)}>查看详情</Button>
          {record.status === 1 && (
            <Button type="link" onClick={() => handleShip(record.orderNo)}>发货</Button>
          )}
          {record.status === 1 && (
            <Button type="link" onClick={() => openAddressModal(record.orderNo)}>修改地址</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <Card title="订单管理">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderNo"
        loading={loading}
        pagination={{ current: page, pageSize: size, total, onChange: (p, s) => { setPage(p); setSize(s); } }}
      />

      <Modal
        title="修改订单地址"
        open={addressModalVisible}
        onOk={handleUpdateAddress}
        onCancel={() => { setAddressModalVisible(false); form.resetFields(); }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="shippingAddress" label="收货地址" rules={[{ required: true, message: '请输入新的收货地址' }]}>
            <Input.TextArea rows={3} placeholder="请输入新的收货地址" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MerchantOrders;


