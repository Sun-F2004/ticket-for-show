# 演出购票系统前端

基于Vue2和Element-UI开发的演出购票系统前端项目，参考大麦网的布局风格设计。

## 项目特性

- 🎭 完整的演出购票流程
- 🎨 现代化UI设计，参考大麦网风格
- 📱 响应式设计，支持移动端
- 🔐 用户认证和授权
- 🛒 购物车功能
- 📋 订单管理
- 👤 用户中心
- 🔍 搜索和筛选功能

## 技术栈

- **前端框架**: Vue 2.6.14
- **UI组件库**: Element-UI 2.15.13
- **状态管理**: Vuex 3.6.2
- **路由管理**: Vue Router 3.5.4
- **HTTP客户端**: Axios 0.27.2
- **样式预处理**: Sass
- **构建工具**: Vue CLI 5.0.8

## 项目结构

```
ticket-for-show/
├── public/                 # 静态资源
│   └── index.html         # HTML模板
├── src/                   # 源代码
│   ├── api/              # API接口
│   │   ├── user.js       # 用户相关API
│   │   ├── show.js       # 演出相关API
│   │   ├── cart.js       # 购物车相关API
│   │   └── order.js      # 订单相关API
│   ├── components/       # 公共组件
│   │   ├── Header.vue    # 头部组件
│   │   └── Footer.vue    # 底部组件
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── store/            # Vuex状态管理
│   │   ├── index.js      # 主store
│   │   └── modules/      # 模块化store
│   │       ├── user.js   # 用户模块
│   │       ├── show.js   # 演出模块
│   │       ├── cart.js   # 购物车模块
│   │       └── order.js  # 订单模块
│   ├── styles/           # 样式文件
│   │   ├── variables.scss # SCSS变量
│   │   └── index.scss    # 全局样式
│   ├── utils/            # 工具函数
│   │   └── request.js    # Axios封装
│   ├── views/            # 页面组件
│   │   ├── Home.vue      # 首页
│   │   ├── Login.vue     # 登录页
│   │   ├── Register.vue  # 注册页
│   │   ├── ShowDetail.vue # 演出详情页
│   │   ├── Cart.vue      # 购物车页
│   │   ├── Order.vue     # 订单页
│   │   └── UserCenter.vue # 用户中心页
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── package.json          # 项目配置
├── vue.config.js         # Vue配置
└── README.md             # 项目说明
```

## 功能模块

### 1. 用户模块
- 用户注册/登录
- 个人资料管理
- 密码修改
- 手机/邮箱绑定

### 2. 演出模块
- 演出列表展示
- 演出详情页
- 演出搜索
- 分类筛选
- 热门推荐

### 3. 购物车模块
- 添加商品到购物车
- 购物车商品管理
- 数量修改
- 商品删除
- 批量操作

### 4. 订单模块
- 订单创建
- 订单确认
- 支付方式选择
- 订单状态跟踪
- 订单历史

### 5. 用户中心
- 个人资料编辑
- 订单管理
- 收藏管理
- 收货地址管理
- 账户安全设置

## API接口

项目包含完整的API接口定义，涵盖以下功能：

### 用户相关
- `POST /api/user/login` - 用户登录
- `POST /api/user/register` - 用户注册
- `GET /api/user/info` - 获取用户信息
- `PUT /api/user/update` - 更新用户信息
- `PUT /api/user/change-password` - 修改密码
- `POST /api/user/send-code` - 发送验证码

### 演出相关
- `GET /api/show/list` - 获取演出列表
- `GET /api/show/detail/:id` - 获取演出详情
- `GET /api/show/search` - 搜索演出
- `GET /api/show/categories` - 获取演出分类
- `GET /api/show/hot` - 获取热门演出
- `GET /api/show/recommended` - 获取推荐演出
- `GET /api/show/:id/sessions` - 获取演出场次
- `GET /api/show/session/:id/seats` - 获取座位信息

### 购物车相关
- `GET /api/cart` - 获取购物车
- `POST /api/cart/add` - 添加到购物车
- `DELETE /api/cart/remove/:id` - 从购物车移除
- `PUT /api/cart/update/:id` - 更新购物车商品
- `DELETE /api/cart/clear` - 清空购物车

### 订单相关
- `POST /api/order/create` - 创建订单
- `GET /api/order/list` - 获取订单列表
- `GET /api/order/detail/:id` - 获取订单详情
- `PUT /api/order/cancel/:id` - 取消订单
- `POST /api/order/pay/:id` - 支付订单
- `PUT /api/order/confirm/:id` - 确认收货
- `POST /api/order/refund/:id` - 申请退款

## 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run serve
```

### 生产环境构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 开发说明

### 1. 项目配置
- 开发服务器端口：8080
- API代理配置：`/api` -> `http://localhost:3000`
- 支持热重载

### 2. 样式规范
- 使用SCSS预处理器
- 采用BEM命名规范
- 响应式设计，支持移动端适配
- 统一的颜色和间距变量

### 3. 组件开发
- 组件采用单文件组件（SFC）格式
- 使用Vuex进行状态管理
- 组件间通信主要通过props和events
- 公共组件放在components目录

### 4. 路由管理
- 使用Vue Router进行路由管理
- 支持路由守卫，保护需要登录的页面
- 支持路由参数和查询参数

### 5. API调用
- 使用Axios进行HTTP请求
- 统一的请求拦截器和响应拦截器
- 支持请求和响应错误处理
- 自动添加认证token

## 部署说明

### 1. 构建生产版本
```bash
npm run build
```

### 2. 部署到服务器
将`dist`目录下的文件部署到Web服务器

### 3. 环境变量配置
- 开发环境：`.env.development`
- 生产环境：`.env.production`

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者：[您的姓名]
- 邮箱：[您的邮箱]
- 项目地址：[项目GitHub地址]

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 完成基础功能开发
- 支持用户注册登录
- 支持演出浏览和购票
- 支持购物车和订单管理 