<template>
  <div class="user-center">
    <Header/>

    <div class="user-container">
      <div class="container">
        <div class="user-content">
          <!-- 侧边栏 -->
          <div class="user-sidebar">
            <div class="user-info">
              <div class="avatar">
                <i class="el-icon-user"></i>
              </div>
              <h3>{{ userInfo.username || '用户' }}</h3>
              <p>{{ userInfo.email || '未设置邮箱' }}</p>
            </div>

            <el-menu
                :default-active="activeMenu"
                class="user-menu"
                @select="handleMenuSelect"
            >
              <el-menu-item index="profile">
                <i class="el-icon-user"></i>
                <span>个人资料</span>
              </el-menu-item>
              <el-menu-item index="orders">
                <i class="el-icon-tickets"></i>
                <span>我的订单</span>
              </el-menu-item>
              <el-menu-item index="favorites">
                <i class="el-icon-star-on"></i>
                <span>我的收藏</span>
              </el-menu-item>
              <el-menu-item index="address">
                <i class="el-icon-location"></i>
                <span>收货地址</span>
              </el-menu-item>
              <el-menu-item index="security">
                <i class="el-icon-lock"></i>
                <span>账户安全</span>
              </el-menu-item>
            </el-menu>
          </div>

          <!-- 主内容区 -->
          <div class="user-main">
            <!-- 个人资料 -->
            <div v-if="activeMenu === 'profile'" class="profile-section">
              <h2>个人资料</h2>
              <el-form
                  ref="profileForm"
                  :model="profileForm"
                  :rules="profileRules"
                  label-width="100px"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="profileForm.username"/>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                  <el-input v-model="profileForm.realName"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="profileForm.phone"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileForm.email"/>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="profileForm.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                    <el-radio label="other">其他</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                  <el-date-picker
                      v-model="profileForm.birthday"
                      type="date"
                      placeholder="选择生日"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateProfile">保存修改</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 我的订单 -->
            <div v-if="activeMenu === 'orders'" class="orders-section">
              <h2>我的订单</h2>
              <div class="order-tabs">
                <el-tabs v-model="orderTab" @tab-click="handleOrderTabClick">
                  <el-tab-pane label="全部" name="all"/>
                  <el-tab-pane label="待付款" name="unpaid"/>
                  <el-tab-pane label="待发货" name="unshipped"/>
                  <el-tab-pane label="已完成" name="completed"/>
                  <el-tab-pane label="已取消" name="cancelled"/>
                </el-tabs>
              </div>

              <div v-loading="orderLoading" class="orders-list">
                <div v-for="order in orderList" :key="order.id" class="order-item">
                  <div class="order-header">
                    <span class="order-number">订单号：{{ order.orderNumber }}</span>
                    <span class="order-status">{{ getOrderStatusText(order.status) }}</span>
                  </div>
                  <div class="order-content">
                    <div v-for="item in order.items" :key="item.id" class="order-product">
                      <img :src="item.image" :alt="item.title"/>
                      <div class="product-info">
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.venue }} | {{ item.time }}</p>
                        <p>数量：{{ item.quantity }}</p>
                      </div>
                      <div class="product-price">
                        <span>¥{{ item.price }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="order-footer">
                    <div class="order-total">
                      总计：<span class="total-price">¥{{ order.totalAmount }}</span>
                    </div>
                    <div class="order-actions">
                      <el-button v-if="order.status === 'unpaid'" type="primary" size="small">
                        立即付款
                      </el-button>
                      <el-button v-if="order.status === 'unpaid'" size="small" @click="cancelOrder(order.id)">
                        取消订单
                      </el-button>
                      <el-button size="small" @click="viewOrderDetail(order.id)">
                        查看详情
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 我的收藏 -->
            <div v-if="activeMenu === 'favorites'" class="favorites-section">
              <h2>我的收藏</h2>
              <div class="favorites-grid">
                <div v-for="show in favorites" :key="show.id" class="favorite-item">
                  <img :src="show.image" :alt="show.title"/>
                  <div class="favorite-info">
                    <h4>{{ show.title }}</h4>
                    <p>{{ show.venue }}</p>
                    <p>{{ show.time }}</p>
                    <div class="favorite-actions">
                      <el-button type="primary" size="small" @click="goToShow(show.id)">
                        立即购票
                      </el-button>
                      <el-button size="small" @click="removeFavorite(show.id)">
                        取消收藏
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 收货地址 -->
            <div v-if="activeMenu === 'address'" class="address-section">
              <h2>收货地址</h2>
              <div class="address-list">
                <div v-for="address in addresses" :key="address.id" class="address-item">
                  <div class="address-info">
                    <h4>{{ address.name }} {{ address.phone }}</h4>
                    <p>{{ address.province }} {{ address.city }} {{ address.district }}</p>
                    <p>{{ address.detail }}</p>
                  </div>
                  <div class="address-actions">
                    <el-button type="text" size="small" @click="editAddress(address)">
                      编辑
                    </el-button>
                    <el-button type="text" size="small" @click="deleteAddress(address.id)">
                      删除
                    </el-button>
                  </div>
                </div>
                <el-button type="dashed" @click="addAddress">
                  <i class="el-icon-plus"></i>
                  添加新地址
                </el-button>
              </div>
            </div>

            <!-- 账户安全 -->
            <div v-if="activeMenu === 'security'" class="security-section">
              <h2>账户安全</h2>
              <div class="security-items">
                <div class="security-item">
                  <div class="security-info">
                    <h4>登录密码</h4>
                    <p>建议定期更换密码，确保账户安全</p>
                  </div>
                  <el-button @click="changePassword">修改密码</el-button>
                </div>
                <div class="security-item">
                  <div class="security-info">
                    <h4>手机绑定</h4>
                    <p>已绑定：{{ userInfo.phone || '未绑定' }}</p>
                  </div>
                  <el-button @click="bindPhone">绑定手机</el-button>
                </div>
                <div class="security-item">
                  <div class="security-info">
                    <h4>邮箱绑定</h4>
                    <p>已绑定：{{ userInfo.email || '未绑定' }}</p>
                  </div>
                  <el-button @click="bindEmail">绑定邮箱</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Header from '@/components/Header.vue'

export default {
  name: 'UserCenter',
  components: {
    Header
  },
  data() {
    return {
      activeMenu: 'profile',
      orderTab: 'all',
      orderLoading: false,
      profileForm: {
        username: '',
        realName: '',
        phone: '',
        email: '',
        gender: '',
        birthday: ''
      },
      profileRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        phone: [
          {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ]
      },
      orderList: [],
      favorites: [],
      addresses: []
    }
  },
  computed: {
    ...mapGetters('user', ['userInfo'])
  },
  watch: {
    $route(to) {
      const tab = to.query.tab
      if (tab) {
        this.activeMenu = tab
      }
    }
  },
  mounted() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeMenu = tab
    }
    this.loadUserData()
  },
  methods: {
    ...mapActions('user', ['updateUserInfo']),
    ...mapActions('order', ['getOrderList']),

    handleMenuSelect(key) {
      this.activeMenu = key
      this.$router.push({query: {tab: key}})
    },

    async loadUserData() {
      // 加载用户数据
      this.profileForm = {...this.userInfo}

      // 加载订单数据
      await this.loadOrders()

      // 加载收藏数据
      this.loadFavorites()

      // 加载地址数据
      this.loadAddresses()
    },

    async loadOrders() {
      this.orderLoading = true
      try {
        const response = await this.getOrderList({status: this.orderTab})
        this.orderList = response.data || this.getMockOrders()
      } catch (error) {
        console.error('加载订单失败:', error)
        this.orderList = this.getMockOrders()
      } finally {
        this.orderLoading = false
      }
    },

    getMockOrders() {
      return [
        {
          id: 1,
          orderNumber: 'ORD20240101001',
          status: 'unpaid',
          totalAmount: 1160,
          items: [
            {
              id: 1,
              title: '周杰伦2024巡回演唱会-北京站',
              venue: '北京工人体育馆',
              time: '2024-06-15 19:30',
              price: 580,
              quantity: 2,
              image: 'https://via.placeholder.com/80x80/ff6b35/ffffff?text=演唱会'
            }
          ]
        }
      ]
    },

    loadFavorites() {
      this.favorites = [
        {
          id: 1,
          title: '周杰伦2024巡回演唱会-北京站',
          venue: '北京工人体育馆',
          time: '2024-06-15 19:30',
          image: 'https://via.placeholder.com/200x150/ff6b35/ffffff?text=演唱会'
        }
      ]
    },

    loadAddresses() {
      this.addresses = [
        {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detail: '三里屯街道1号'
        }
      ]
    },

    getOrderStatusText(status) {
      const statusMap = {
        unpaid: '待付款',
        unshipped: '待发货',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },

    async updateProfile() {
      try {
        await this.updateUserInfo(this.profileForm)
        this.$message.success('个人资料更新成功')
      } catch (error) {
        this.$message.error('更新失败')
      }
    },

    handleOrderTabClick() {
      this.loadOrders()
    },

    cancelOrder(orderId) {
      this.$confirm('确定要取消这个订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('订单已取消')
        this.loadOrders()
      })
    },

    viewOrderDetail(orderId) {
      this.$message.info('订单详情功能开发中')
    },

    goToShow(showId) {
      this.$router.push(`/show/${showId}`)
    },

    removeFavorite(showId) {
      this.$confirm('确定要取消收藏吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.favorites = this.favorites.filter(item => item.id !== showId)
        this.$message.success('已取消收藏')
      })
    },

    addAddress() {
      this.$message.info('添加地址功能开发中')
    },

    editAddress(address) {
      this.$message.info('编辑地址功能开发中')
    },

    deleteAddress(addressId) {
      this.$confirm('确定要删除这个地址吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addresses = this.addresses.filter(item => item.id !== addressId)
        this.$message.success('地址已删除')
      })
    },

    changePassword() {
      this.$message.info('修改密码功能开发中')
    },

    bindPhone() {
      this.$message.info('绑定手机功能开发中')
    },

    bindEmail() {
      this.$message.info('绑定邮箱功能开发中')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center {
  min-height: 100vh;
  background: $background-color-base;
}

.user-container {
  padding: 40px 0;
}

.user-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

.user-sidebar {
  background: #fff;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-light;
  overflow: hidden;
}

.user-info {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid $border-color-light;

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;

    i {
      font-size: 40px;
      color: #fff;
    }
  }

  h3 {
    font-size: $font-size-large;
    color: $text-primary;
    margin-bottom: 5px;
  }

  p {
    color: $text-secondary;
    font-size: $font-size-small;
  }
}

.user-menu {
  border: none;

  .el-menu-item {
    height: 50px;
    line-height: 50px;

    i {
      margin-right: 10px;
    }
  }
}

.user-main {
  background: #fff;
  border-radius: $border-radius-large;
  padding: 30px;
  box-shadow: $box-shadow-light;

  h2 {
    font-size: 24px;
    color: $text-primary;
    margin-bottom: 30px;
    font-weight: bold;
  }
}

.orders-section {
  .order-tabs {
    margin-bottom: 20px;
  }

  .orders-list {
    .order-item {
      border: 1px solid $border-color-light;
      border-radius: $border-radius-base;
      margin-bottom: 20px;
      overflow: hidden;

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: $background-color-light;
        border-bottom: 1px solid $border-color-light;

        .order-number {
          font-weight: 600;
          color: $text-primary;
        }

        .order-status {
          color: $primary-color;
          font-weight: 600;
        }
      }

      .order-content {
        padding: 20px;

        .order-product {
          display: flex;
          align-items: center;
          margin-bottom: 15px;

          &:last-child {
            margin-bottom: 0;
          }

          img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: $border-radius-base;
            margin-right: 15px;
          }

          .product-info {
            flex: 1;

            h4 {
              font-size: $font-size-medium;
              color: $text-primary;
              margin-bottom: 5px;
            }

            p {
              font-size: $font-size-small;
              color: $text-secondary;
              margin-bottom: 3px;
            }
          }

          .product-price {
            color: $primary-color;
            font-weight: bold;
          }
        }
      }

      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: $background-color-light;
        border-top: 1px solid $border-color-light;

        .order-total {
          .total-price {
            color: $primary-color;
            font-size: $font-size-large;
            font-weight: bold;
          }
        }

        .order-actions {
          display: flex;
          gap: 10px;
        }
      }
    }
  }
}

.favorites-section {
  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;

    .favorite-item {
      border: 1px solid $border-color-light;
      border-radius: $border-radius-base;
      overflow: hidden;

      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
      }

      .favorite-info {
        padding: 15px;

        h4 {
          font-size: $font-size-medium;
          color: $text-primary;
          margin-bottom: 8px;
        }

        p {
          font-size: $font-size-small;
          color: $text-secondary;
          margin-bottom: 5px;
        }

        .favorite-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
      }
    }
  }
}

.address-section {
  .address-list {
    .address-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border: 1px solid $border-color-light;
      border-radius: $border-radius-base;
      margin-bottom: 15px;

      .address-info {
        h4 {
          font-size: $font-size-medium;
          color: $text-primary;
          margin-bottom: 8px;
        }

        p {
          font-size: $font-size-small;
          color: $text-secondary;
          margin-bottom: 5px;
        }
      }

      .address-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}

.security-section {
  .security-items {
    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border: 1px solid $border-color-light;
      border-radius: $border-radius-base;
      margin-bottom: 15px;

      .security-info {
        h4 {
          font-size: $font-size-medium;
          color: $text-primary;
          margin-bottom: 5px;
        }

        p {
          font-size: $font-size-small;
          color: $text-secondary;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-content {
    grid-template-columns: 1fr;
  }

  .favorites-grid {
    grid-template-columns: 1fr !important;
  }

  .order-item {
    .order-footer {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  }
}
</style>
