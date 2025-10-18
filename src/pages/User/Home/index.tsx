import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Carousel, Spin } from 'antd';
import { ShoppingOutlined, TruckOutlined, CustomerServiceOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProductList } from '@/apis/product';
import type { Product, PageRequest } from '@/types';
import './index.css';

const { Title, Paragraph } = Typography;

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      setLoading(true);
      try {
        const params: PageRequest = { page: 1, size: 8 };
        const res = await getProductList(params);
        setProducts(res.data.records || []);
      } catch (e) {
        // 忽略错误，展示空态
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  const latestProducts = products.slice(0, 4);
  const hotProducts = products.slice(4, 8);

  const features = [
    {
      icon: <ShoppingOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: '优质商品',
      description: '精选乡村特色农产品，绿色健康'
    },
    {
      icon: <TruckOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '快速配送',
      description: '高效物流，新鲜直达'
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      title: '贴心服务',
      description: '7x24小时在线客服'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
      title: '安全保障',
      description: '正品保证，放心购买'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-content">

      {/* 主视觉 CTA */}
      <Card className="cta-card">
        <div className="cta-content">
          <Title level={2} className="cta-title">欢迎来到乡村振兴电商云平台</Title>
          <Paragraph className="cta-description">
            连接乡村与城市，助力乡村振兴
          </Paragraph>
          <Button type="primary" size="large" onClick={() => navigate('/user/products')}>
            开始购物
          </Button>
        </div>
      </Card>
      {/* 轮播图 */}
      <Card className="carousel-card">
        <Carousel autoplay dots className="carousel-container">
          <div>
            <img src={'https://khy.hhhwww.top/banner1.png'} alt="banner0" className="carousel-image" />
          </div>
          <div>
            <img src={'https://khy.hhhwww.top/banner0.png'} alt="banner2" className="carousel-image" />
          </div>
          <div>
            <img src={'https://khy.hhhwww.top/banner2.png'} alt="banner3" className="carousel-image" />
          </div>
        </Carousel>
      </Card>



      {/* 专题栏：最近上新 */}
      <div className="home-panel">
        <div className="container">
          <div className="head">
            <h3>
              最近上新<small>新鲜出炉 品质靠谱</small>
            </h3>
          </div>
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {latestProducts.map((product) => (
                <Col xs={24} sm={12} md={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="product-image"
                      />
                    }
                    onClick={() => navigate(`/user/products/${product.id}`)}
                  >
                    <div className="product-card-content">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">¥{product.price}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>
        </div>
      </div>

      {/* 专题栏：人气推荐 */}
      <div className="home-panel">
        <div className="container">
          <div className="head">
            <h3>
              人气推荐<small>人气爆款 不容错过</small>
            </h3>
          </div>
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {hotProducts.map((product) => (
                <Col xs={24} sm={12} md={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="product-image"
                      />
                    }
                    
                    onClick={() => navigate(`/user/products/${product.id}`)}
                  >
                    <div className="product-card-content">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">¥{product.price}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>
        </div>
      </div>


      <Title level={3} className="advantages-title">我们的优势</Title>
      <Row gutter={[16, 16]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card hoverable className="advantage-card">
              <div className="advantage-icon">{feature.icon}</div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
      </div>
    </div>
  );
};

export default UserHome;

