import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select, Button, message, Empty, Spin, Pagination, Tabs } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductList } from '@/apis/product';
import { addToCart } from '@/store/modules/cart';
import type { Product, PageRequest } from '@/types';
import './style.css';

const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<PageRequest>({
    page: 1,
    size: 12,
    keyword: '',
    sortBy: 'price',
    sortOrder: 'asc',
    category: undefined
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
      setTotal(res.data.total);
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

  const categories = ['蔬菜水果', '粮油调味', '肉蛋禽类', '其他'];

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    message.success('已添加到购物车');
  };

  return (
    <div className="product-list-container">
      {/* 重构搜索排序区域 */}
      <Card className="search-card">
        <div className="search-sort-container">
          <div className="search-wrapper">
            <Search
              placeholder="搜索商品..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </div>
          <div className="sort-wrapper">
            <Select
              className="sort-select"
              defaultValue="price-asc"
              size="large"
              onChange={handleSortChange}
            >
              <Option value="price-asc">价格从低到高</Option>
              <Option value="price-desc">价格从高到低</Option>
            </Select>
          </div>
        </div>
        <div className="category-tabs">
          <Tabs
            activeKey={searchParams.category ?? 'all'}
            onChange={(key) => setSearchParams({ ...searchParams, category: key === 'all' ? undefined : key, page: 1 })}
            items={[{ key: 'all', label: '全部' }, ...categories.map((c) => ({ key: c, label: c }))]}
          />
        </div>

      <div className="loading-container">
        <Spin spinning={loading}>
          {products.length > 0 ? (
            <Row gutter={[16, 16]} className="product-grid">
              {products.map(product => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    className="product-card"
                    hoverable
                    onClick={() => navigate(`/user/products/${product.id}`)}
                    cover={
                      <img
                        alt={product.name}
                        src={product.image || '/placeholder-image.jpg'}
                        className="product-image"
                      />
                    }
                    actions={[
                      <Button
                        className="add-to-cart-btn"
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          // 核心修改：阻止事件冒泡，防止触发父级 Card 的 onClick
                          e.stopPropagation(); 
                          handleAddToCart(product);
                      }}
                        disabled={product.status === 0 || product.stock === 0}
                      >
                        加入购物车
                      </Button>
                    ]}
                  >
                    <div className="product-info">
                      <div
                        className="product-name"
                        onClick={() => navigate(`/user/products/${product.id}`)}
                      >
                        {product.name}
                      </div>
                      <div>
                        <div className="product-price">¥{product.price}</div>
                        <div className="product-stock">库存：{product.stock}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty className="empty-state" description="暂无商品" />
          )}
          {products.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                current={searchParams.page}
                pageSize={searchParams.size}
                total={total}
                showSizeChanger
                pageSizeOptions={["8", "12", "16", "24", "32"]}
                onChange={(page, pageSize) => setSearchParams({ ...searchParams, page, size: pageSize })}
                showTotal={(t) => `共 ${t} 条`}
              />
            </div>
          )}
        </Spin>
      </div>
      </Card>

    </div>
  );
};

export default ProductList;

