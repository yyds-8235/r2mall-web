import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, InputNumber, message, Spin, Descriptions, Image } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetail } from '@/apis/product';
import { addToCart } from '@/store/modules/cart';
import type { Product } from '@/types';
import type { RootState } from '@/store';
import ChatWindow from '@/components/ChatWindow';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [chatVisible, setChatVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await getProductDetail(Number(id));
      setProduct(res.data);
    } catch (error) {
      console.error('获取商品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    message.success('已添加到购物车');
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!userInfo) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ product, quantity }));
    navigate('/user/cart');
  };

  const handleContactMerchant = () => {
    if (!userInfo) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    setChatVisible(true);
  };

  if (loading) {
    return <Spin spinning={loading} />;
  }

  if (!product) {
    return <Card>商品不存在</Card>;
  }

  return (
    <div>
      <Card>
        <Row gutter={24}>
          <Col xs={24} md={10}>
            <Image
              src={product.image}
              alt={product.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Col>
          <Col xs={24} md={14}>
            <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>{product.name}</h1>
            <div style={{ fontSize: '32px', color: '#f5222d', fontWeight: 'bold', marginBottom: '24px' }}>
              ¥{product.price}
            </div>
            <Descriptions column={1} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="库存">{product.stock}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {product.status === 1 ? '在售' : '已下架'}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ marginRight: '16px' }}>数量：</span>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
              />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={product.status === 0 || product.stock === 0}
              >
                加入购物车
              </Button>
              <Button
                type="primary"
                size="large"
                danger
                icon={<ShoppingOutlined />}
                onClick={handleBuyNow}
                disabled={product.status === 0 || product.stock === 0}
              >
                立即购买
              </Button>
              <Button
                size="large"
                icon={<CustomerServiceOutlined />}
                onClick={handleContactMerchant}
              >
                联系商家
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="商品详情" style={{ marginTop: '24px' }}>
        <p>{product.description || '暂无详细描述'}</p>
      </Card>

      {chatVisible && product && (
        <ChatWindow
          visible={chatVisible}
          onClose={() => setChatVisible(false)}
          toUserId={product.merchantId}
          toUserName="商家"
        />
      )}
    </div>
  );
};

export default ProductDetail;

