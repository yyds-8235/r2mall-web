# 乡村振兴电商云平台

基于 React + TypeScript + Ant Design + Redux Toolkit 构建的现代化电商平台。

## 核心功能

### 用户端
- 用户注册/登录
- 个人信息管理（头像、性别、出生日期）
- 收货地址管理
- 商品浏览/搜索（支持价格排序）
- 购物车管理
- 创建订单
- 模拟支付
- 订单查看
- 与商家实时客服沟通

### 商家端
- 商家入驻/登录
- 店铺信息管理
- 商品发布
- 商品管理（上下架、编辑）
- 与用户实时客服沟通

## 技术栈

- **框架**: React 19
- **语言**: TypeScript
- **UI组件**: Ant Design 5
- **状态管理**: Redux Toolkit
- **路由**: React Router v7
- **HTTP请求**: Axios
- **实时通信**: WebSocket
- **构建工具**: Vite
- **日期处理**: Day.js

## 项目结构

```
src/
├── apis/              # API接口封装
│   ├── auth.ts       # 认证接口
│   ├── user.ts       # 用户接口
│   ├── merchant.ts   # 商家接口
│   ├── product.ts    # 商品接口
│   └── order.ts      # 订单接口
├── components/       # 公共组件
│   ├── ChatWindow.tsx       # 客服聊天窗口
│   ├── UserLayout.tsx       # 用户端布局
│   └── MerchantLayout.tsx   # 商家端布局
├── pages/           # 页面组件
│   ├── Login/       # 登录/注册页
│   ├── User/        # 用户端页面
│   │   ├── Home/           # 首页
│   │   ├── ProductList/    # 商品列表
│   │   ├── ProductDetail/  # 商品详情
│   │   ├── Cart/           # 购物车
│   │   ├── Checkout/       # 结算页
│   │   ├── Orders/         # 订单列表
│   │   ├── OrderDetail/    # 订单详情
│   │   └── Profile/        # 个人中心
│   └── Merchant/    # 商家端页面
│       ├── Dashboard/      # 控制台
│       ├── Products/       # 商品管理
│       ├── Profile/        # 店铺设置
│       └── Messages/       # 客服消息
├── store/           # Redux状态管理
│   ├── modules/
│   │   ├── user.ts  # 用户状态
│   │   └── cart.ts  # 购物车状态
│   └── index.ts
├── types/           # TypeScript类型定义
├── utils/           # 工具函数
│   ├── request.ts   # axios封装
│   └── websocket.ts # WebSocket封装
└── router/          # 路由配置
```

## API接口

### 认证接口 (/api/auth)
- `POST /login` - 统一登录
- `POST /user/register` - 用户注册
- `POST /merchant/register` - 商家入驻
- `POST /logout` - 注销登录

### 用户端接口
- `GET /user/profile` - 获取个人信息
- `PUT /user/profile` - 修改个人信息
- `GET /user/addresses` - 获取地址列表
- `POST /user/addresses` - 新增地址
- `GET /user/products` - 浏览/搜索商品
- `GET /user/products/:id` - 获取商品详情
- `POST /user/orders/create` - 创建订单
- `POST /user/orders/:orderNo/pay` - 模拟支付
- `GET /user/orders` - 查看订单列表
- `GET /user/orders/:orderNo` - 查看订单详情

### 商家端接口
- `GET /merchant/profile` - 获取商家信息
- `PUT /merchant/profile` - 修改店铺信息
- `GET /merchant/products` - 获取我的商品
- `POST /merchant/products` - 上架新商品
- `PUT /merchant/products/:id` - 编辑商品
- `PUT /merchant/products/:id/status` - 上下架商品

### WebSocket客服聊天
```
ws://localhost:8082/im/{from_role}/{to_id}
```
- `from_role`: 发起方角色（user 或 merchant）
- `to_id`: 对方ID

## 安装与运行

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 配置说明

### 后端服务地址配置
在 `vite.config.ts` 中配置代理：
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 后端服务地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### WebSocket服务地址配置
在 `src/utils/websocket.ts` 中修改：
```typescript
this.url = `ws://localhost:8082/im/${fromRole}/${toId}`;
```

## 功能特性

### 用户端
1. **商品浏览**: 支持关键词搜索、价格排序
2. **购物车**: 商品数量管理、批量结算
3. **订单流程**: 地址选择 → 订单确认 → 模拟支付
4. **个人中心**: 信息编辑、地址管理、密码修改
5. **实时客服**: WebSocket 实时聊天

### 商家端
1. **商品管理**: 发布、编辑、上下架
2. **店铺设置**: 店铺信息管理
3. **客服系统**: 实时接收用户消息

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件采用函数式组件 + Hooks

### 命名规范
- 组件文件：PascalCase (如 `UserLayout.tsx`)
- 工具函数：camelCase (如 `getUserProfile`)
- 常量：UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- 接口/类型：PascalCase (如 `User`, `Product`)

### Git提交规范
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具链相关

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## License

MIT
