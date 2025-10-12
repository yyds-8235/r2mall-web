import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { ShoppingOutlined, DollarOutlined, UserOutlined, MessageOutlined, BarChartOutlined, PieChartOutlined, SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { getMerchantStats, getCategorySalesStats, type MerchantStats, type CategorySalesData } from '@/apis/user';

const MerchantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<MerchantStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySalesData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchCategoryStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getMerchantStats();
      setStats(res.data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const res = await getCategorySalesStats();
      setCategoryData(res.data);
    } catch (error) {
      console.error('获取分类统计失败:', error);
    }
  };

  // 商品类型销售数量饼状图配置
  const countPieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '销售数量',
        type: 'pie',
        radius: '50%',
        data: categoryData.map(item => ({
          value: item.count,
          name: item.category
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // 商品类型销售额饼状图配置
  const salesPieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        radius: '50%',
        data: categoryData.map(item => ({
          value: item.sales,
          name: item.category
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const quickActions = [
    {
      title: '商品管理',
      description: '管理您的商品信息',
      icon: <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      onClick: () => navigate('/merchant/products'),
    },
    {
      title: '订单管理',
      description: '查看和处理订单',
      icon: <ShoppingCartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      onClick: () => navigate('/merchant/orders'),
    },
    {
      title: '客服消息',
      description: '处理客户咨询',
      icon: <MessageOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      onClick: () => navigate('/merchant/messages'),
    },
    {
      title: '店铺设置',
      description: '管理店铺信息',
      icon: <SettingOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      onClick: () => navigate('/merchant/profile'),
    },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <h2 style={{ marginBottom: '24px' }}>控制台</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>加载数据中...</div>
          </div>
        ) : (
          <>
            {/* 统计卡片 */}
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="商品总数"
                    value={stats?.totalProducts || 0}
                    prefix={<ShoppingOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="订单总数"
                    value={stats?.totalOrders || 0}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="总销售额"
                    value={stats?.totalSales || 0}
                    prefix={<DollarOutlined />}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="咨询人次"
                    value={stats?.totalConsultations || 0}
                    prefix={<MessageOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* 饼状图 */}
            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col xs={24} lg={12}>
                <Card title="各商品类型销售数量" extra={<PieChartOutlined />}>
                  <div style={{ height: '300px' }}>
                    <ReactECharts option={countPieOption} style={{ height: '100%' }} />
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="各商品类型销售额" extra={<BarChartOutlined />}>
                  <div style={{ height: '300px' }}>
                    <ReactECharts option={salesPieOption} style={{ height: '100%' }} />
                  </div>
                </Card>
              </Col>
            </Row>

            {/* 快速入口 */}
            <Card title="快速入口" style={{ marginTop: '24px' }}>
              <Row gutter={[16, 16]}>
                {quickActions.map((action, index) => (
                  <Col xs={24} sm={12} md={6} key={index}>
                    <Card
                      hoverable
                      style={{ textAlign: 'center', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                      onClick={action.onClick}
                    >
                      <div style={{ marginBottom: '8px' }}>{action.icon}</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{action.title}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{action.description}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;

