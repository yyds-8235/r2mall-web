import React, { useState } from 'react';
import { Card, Table, Button, InputNumber, message, Empty, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { removeFromCart, updateCartItemQuantity } from '@/store/modules/cart';
import type { CartItem } from '@/types';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const handleQuantityChange = (productId: number, quantity: number) => {
    dispatch(updateCartItemQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
    message.success('已从购物车移除');
  };

  const handleCheckout = () => {
    if (!userInfo) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要结算的商品');
      return;
    }
    const selectedItems = items.filter(item => selectedRowKeys.includes(item.product.id));
    navigate('/user/checkout', { state: { items: selectedItems } });
  };

  const totalPrice = items
    .filter(item => selectedRowKeys.includes(item.product.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const columns = [
    {
      title: '商品',
      dataIndex: 'product',
      key: 'product',
      render: (product: CartItem['product']) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={product.image} alt={product.name} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }} />
          <div>{product.name}</div>
        </div>
      )
    },
    {
      title: '单价',
      dataIndex: 'product',
      key: 'price',
      render: (product: CartItem['product']) => <span>¥{product.price}</span>
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.product.stock}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.product.id, value || 1)}
        />
      )
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (record: CartItem) => (
        <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
          ¥{(record.product.price * record.quantity).toFixed(2)}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (record: CartItem) => (
        <Popconfirm
          title="确定要删除这个商品吗？"
          onConfirm={() => handleRemove(record.product.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      )
    }
  ];

  if (items.length === 0) {
    return (
      <Card>
        <Empty description="购物车是空的">
          <Button type="primary" onClick={() => navigate('/user/products')}>
            去购物
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[])
          }}
          columns={columns}
          dataSource={items}
          rowKey={(record) => record.product.id}
          pagination={false}
        />
        <div style={{ marginTop: '24px', textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            已选择 <span style={{ color: '#1890ff' }}>{selectedRowKeys.length}</span> 件商品
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              合计：<span style={{ fontSize: '24px', color: '#f5222d', fontWeight: 'bold' }}>¥{totalPrice.toFixed(2)}</span>
            </div>
            <Button type="primary" size="large" onClick={handleCheckout}>
              去结算
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Cart;

