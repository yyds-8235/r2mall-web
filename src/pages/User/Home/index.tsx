import React from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';
import { ShoppingOutlined, TruckOutlined, CustomerServiceOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const UserHome: React.FC = () => {
  const navigate = useNavigate();

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
    <div>
      <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
        <div style={{ textAlign: 'center', color: '#fff', padding: '40px 0' }}>
          <Title level={2} style={{ color: '#fff', marginBottom: '16px' }}>欢迎来到乡村振兴电商云平台</Title>
          <Paragraph style={{ color: '#fff', fontSize: '16px', marginBottom: '24px' }}>
            连接乡村与城市，助力乡村振兴
          </Paragraph>
          <Button type="primary" size="large" onClick={() => navigate('/user/products')}>
            开始购物
          </Button>
        </div>
      </Card>

      <Title level={3} style={{ marginBottom: '24px' }}>我们的优势</Title>
      <Row gutter={[16, 16]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserHome;

