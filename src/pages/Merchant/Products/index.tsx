import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Switch, message, Image, Spin, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { getMerchantProducts, addProduct, updateProduct, updateProductStatus } from '@/apis/merchant';
import { uploadFile } from '@/apis/file';
import type { Product } from '@/types';

const MerchantProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getMerchantProducts();
      setProducts(res.data.records);
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImageUrl(product.image);
    form.setFieldsValue(product);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setImageUrl(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleBeforeUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadFile(file);
      setImageUrl(res.data);
      form.setFieldValue('image', res.data);
      message.success('图片上传成功');
    } catch (error) {
      message.error('图片上传失败');
    } finally {
      setUploading(false);
    }
  };
  
  const handleImageClick = () => {
    // 点击图片区域触发文件选择
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBeforeUpload(file);
    }
    // 清除输入值，以便可以选择同一个文件
    e.target.value = '';
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 先定义好需要的商品数据字段
      const productData = {
        name: values.name,
        image: imageUrl,
        price: values.price,
        stock: values.stock,
        category: values.category,
        description: values.description,
        status: values.status ? 1 : 0
      };
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        message.success('商品更新成功');
      } else {
        await addProduct(productData);
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
      key: 'image', align: 'center' as const,
      render: (image: string) => <Image src={image} width={60} height={60} style={{ objectFit: 'cover' }} />
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name', align: 'center' as const
    },
    {
      title: '商品类别',
      dataIndex: 'category',
      key: 'category', align: 'center' as const,
      render: (v: number | string) => {
        const map: Record<string, { text: string; color: string }> = {
          '蔬菜水果': { text: '蔬菜水果', color: 'green' },
          '粮油调味': { text: '粮油调味', color: 'gold' },
          '肉蛋禽类': { text: '肉蛋禽类', color: 'orange' },
          '休闲零食': { text: '休闲零食', color: 'pink' },
          '其他': { text: '其他', color: 'blue' }
        };
        const key = (v ?? '其他').toString();
        const m = map[key] || map['other'];
        return <Tag color={m.color}>{m.text}</Tag>;
      }
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price', align: 'center' as const,
      render: (price: number) => <span>¥{price}</span>
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock', align: 'center' as const
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status', align: 'center' as const,
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
      key: 'action', align: 'center' as const,
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
            name="category"
            label="商品类别"
            rules={[{ required: true, message: '请选择商品类别' }]}
          >
            <Select placeholder="请选择商品类别">
              <Select.Option value={'蔬菜水果'}>蔬菜水果</Select.Option>
              <Select.Option value={'粮油调味'}>粮油调味</Select.Option>
              <Select.Option value={'肉蛋禽类'}>肉蛋禽类</Select.Option>
              <Select.Option value={'休闲零食'}>休闲零食</Select.Option>
              <Select.Option value={'其他'}>其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="商品图片"
            rules={[{ required: true, message: '请上传商品图片' }]}
          >
            {/* 隐藏的文件输入框 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            
            {/* 自定义图片上传区域 */}
            <div 
              style={{
                width: '100px',
                height: '100px',
                border: '1px dashed #d9d9d9',
                borderRadius: '6px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={handleImageClick}
              onMouseEnter={(e) => {
                if (!uploading && imageUrl) {
                  const overlay = e.currentTarget.querySelector('.image-overlay');
                  if (overlay) {
                    (overlay as HTMLElement).style.opacity = '1';
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!uploading && imageUrl) {
                  const overlay = e.currentTarget.querySelector('.image-overlay');
                  if (overlay) {
                    (overlay as HTMLElement).style.opacity = '0';
                  }
                }
              }}
            >
              {uploading ? (
                <Spin tip="上传中..." size="small" />
              ) : imageUrl ? (
                <>
                  <Image 
                    src={imageUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                  <div 
                    className="image-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    <UploadOutlined style={{ color: 'white', fontSize: '20px' }} />
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <UploadOutlined style={{ fontSize: '24px', color: '#999' }} />
                  <div style={{ marginTop: 8, color: '#999', fontSize: '12px' }}>点击上传</div>
                </div>
              )}
            </div>
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

