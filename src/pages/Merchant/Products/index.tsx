import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Modal, Form, Input, InputNumber, Switch, Upload, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { getMerchantProducts, addProduct, updateProduct, updateProductStatus } from '@/apis/merchant';
import type { Product } from '@/types';

const MerchantProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getMerchantProducts();
      setProducts(res.data);
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        message.success('商品更新成功');
      } else {
        await addProduct(values);
        message.success('商品添加成功');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  const handleStatusChange = async (id: number, status: 0 | 1) => {
    try {
      await updateProductStatus(id, status);
      message.success(status === 1 ? '商品已上架' : '商品已下架');
      fetchProducts();
    } catch (error) {
      console.error('修改状态失败:', error);
    }
  };

  const columns = [
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => <Image src={image} width={60} height={60} style={{ objectFit: 'cover' }} />
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span>¥{price}</span>
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: Product) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked ? 1 : 0)}
          checkedChildren="上架"
          unCheckedChildren="下架"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Product) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
      )
    }
  ];

  return (
    <div>
      <Card
        title="商品管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加商品
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingProduct ? '编辑商品' : '添加商品'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="image"
            label="商品图片URL"
            rules={[{ required: true, message: '请输入商品图片URL' }]}
          >
            <Input placeholder="请输入商品图片URL" />
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入库存' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="商品描述"
          >
            <Input.TextArea rows={4} placeholder="请输入商品描述" />
          </Form.Item>
          <Form.Item
            name="status"
            label="上架状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantProducts;

