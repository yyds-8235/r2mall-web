import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select, Button, message, Empty, Spin } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductList } from '@/apis/product';
import { addToCart } from '@/store/modules/cart';
import type { Product, PageRequest } from '@/types';

const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<PageRequest>({
    page: 1,
    size: 12,
    keyword: '',
    sortBy: 'price',
    sortOrder: 'asc'
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductList(searchParams);
      setProducts(res.data.records);
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchParams({ ...searchParams, keyword: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setSearchParams({ ...searchParams, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    message.success('已添加到购物车');
  };

  return (
    <div>
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索商品..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col>
            <Select
              defaultValue="price-asc"
              style={{ width: 150 }}
              size="large"
              onChange={handleSortChange}
            >
              <Option value="price-asc">价格从低到高</Option>
              <Option value="price-desc">价格从高到低</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {products.length > 0 ? (
          <Row gutter={[16, 16]}>
            {products.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ height: 200, objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => navigate(`/user/products/${product.id}`)}
                    />
                  }
                  actions={[
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.status === 0 || product.stock === 0}
                    >
                      加入购物车
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/user/products/${product.id}`)}
                      >
                        {product.name}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: '18px', color: '#f5222d', fontWeight: 'bold' }}>
                          ¥{product.price}
                        </div>
                        <div style={{ color: '#999', marginTop: '8px' }}>
                          库存：{product.stock}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="暂无商品" />
        )}
      </Spin>
    </div>
  );
};

export default ProductList;

