import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, DollarOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';

const MerchantDashboard: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>控制台</h2>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="商品总数"
              value={0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总销售额"
              value={0}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="未读消息"
              value={0}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="快速入口" style={{ marginTop: '24px' }}>
        <p>欢迎使用商家管理后台！</p>
        <p>您可以在这里管理商品、查看订单、处理客服消息等。</p>
      </Card>
    </div>
  );
};

export default MerchantDashboard;

