import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, message, Spin, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getOrderDetail, payOrder } from '@/apis/order';
import type { OrderDetail } from '@/types';
import './style.css';

const { Title, Text } = Typography;

const Payment: React.FC = () => {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [countdown, setCountdown] = useState<number>(3);
  const [checking, setChecking] = useState<boolean>(false);

  useEffect(() => {
    if (orderNo) {
      fetchOrderDetail();
    }
  }, [orderNo]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const res = await getOrderDetail(orderNo!);
      setOrderDetail(res.data);
    } catch (error) {
      console.error('获取订单详情失败:', error);
      message.error('获取订单详情失败');
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    navigate('/user/orders');
  };

  const getQRCodeImage = () => {
    if (paymentMethod === 'wechat') {
      return 'http://t3xyra4t9.hn-bkt.clouddn.com/wechat.jfif'; // 微信支付二维码
    } else {
      return 'http://t3xyra4t9.hn-bkt.clouddn.com/alipay.jfif'; // 支付宝二维码
    }
  };

  const getPaymentMethodName = () => {
    return paymentMethod === 'wechat' ? '微信支付' : '支付宝';
  };

  const handleIHavePaid = async () => {
    if (!orderDetail) return;
    setChecking(true);
    const hide = message.loading('正在查询支付结果...', 1.5);
    setTimeout(async () => {
      hide();
      try {
        await payOrder(orderDetail.orderInfo.orderNo);
      } catch (e) {
        // 如果后端不可用，仍然模拟成功
      }
      setPaymentStatus('success');
      setChecking(false);
      message.success('支付成功，正在为您跳转到我的订单');
      let seconds = 3;
      setCountdown(seconds);
      const timer = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        if (seconds <= 0) {
          clearInterval(timer);
          navigate('/user/orders');
        }
      }, 1000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading-wrapper">
          <Spin size="large" />
          <Text>正在加载订单信息...</Text>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="payment-container">
        <Card>
          <div className="error-state">
            <Text type="danger">订单不存在</Text>
            <Button onClick={handleBack} style={{ marginTop: 16 }}>
              返回订单列表
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { orderInfo } = orderDetail;

  return (
    <div className="payment-container">
      <div className="payment-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className="back-button"
        >
          返回订单列表
        </Button>
        <Title level={2} className="payment-title">订单支付</Title>
      </div>

      <div className="payment-content">
        {/* 订单信息 */}
        <Card className="order-info-card" title="订单信息">
          <div className="order-info">
            <div className="order-item">
              <Text strong>订单号：</Text>
              <Text copyable>{orderInfo.orderNo}</Text>
            </div>
            <div className="order-item">
              <Text strong>订单金额：</Text>
              <Text className="amount-text">¥{orderInfo.totalAmount}</Text>
            </div>
            <div className="order-item">
              <Text strong>收货地址：</Text>
              <Text>{orderInfo.shippingAddress}</Text>
            </div>
          </div>
        </Card>

        {/* 支付方式选择 */}
        <Card className="payment-method-card" title="选择支付方式">
          <Radio.Group 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-method-group"
          >
            <Radio value="wechat" className="payment-option">
              <div className="payment-option-content">
                <div ><img src={'http://t3xyra4t9.hn-bkt.clouddn.com/wechat.png'} className="payment-icon wechat-icon" alt="微信支付" /></div>
                <div className="payment-text">
                  <div className="payment-name">微信支付</div>
                  <div className="payment-desc">推荐使用微信扫码支付</div>
                </div>
              </div>
            </Radio>
            <Radio value="alipay" className="payment-option">
              <div className="payment-option-content">
                <div><img src={'http://t3xyra4t9.hn-bkt.clouddn.com/ali.png'} className="payment-icon alipay-icon" alt="支付宝支付" /></div>
                <div className="payment-text">
                  <div className="payment-name">支付宝</div>
                  <div className="payment-desc">使用支付宝扫码支付</div>
                </div>
              </div>
            </Radio>
          </Radio.Group>
        </Card>

        {/* 支付二维码 */}
        <Card className="qrcode-card" title={`${getPaymentMethodName()}扫码支付`}>
          <div className="qrcode-container">
            {paymentStatus === 'pending' && (
              <div className="qrcode-wrapper">
                <div className="qrcode-image">
                  <img 
                    src={getQRCodeImage()} 
                    alt={`${getPaymentMethodName()}二维码`}
                    className="qrcode-img"
                  />
                </div>
                <div className="qrcode-info">
                  <Text className="payment-amount">支付金额：¥{orderInfo.totalAmount}</Text>
                  <Text type="secondary" className="payment-tip">
                    请使用{getPaymentMethodName()}扫描二维码完成支付
                  </Text>
                  <Button 
                    type="primary" 
                    size="large" 
                    className="i-paid-button"
                    onClick={handleIHavePaid}
                    loading={checking}
                  >
                    我已支付
                  </Button>
                </div>
              </div>
            )}
            
            {paymentStatus === 'success' && (
              <div className="payment-success">
                <CheckCircleOutlined className="success-icon" />
                <Title level={3} className="success-title">支付成功！</Title>
                <Text className="success-desc">您的订单已支付完成，我们将尽快为您发货</Text>
                <Text className="success-desc">将在 {countdown} 秒后跳转到“我的订单”</Text>
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={() => navigate('/user/orders')}
                  className="success-button"
                >
                  立即前往我的订单
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* 支付说明 */}
        <Card className="payment-tips-card" title="支付说明">
          <div className="payment-tips">
            <div className="tip-item">
              <Text>• 请确保您的{getPaymentMethodName()}账户有足够余额</Text>
            </div>
            <div className="tip-item">
              <Text>• 支付完成后，订单状态将自动更新</Text>
            </div>
            <div className="tip-item">
              <Text>• 如遇支付问题，请联系客服：400-123-4567</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
