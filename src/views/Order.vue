<template>
  <div class="order-page">
    <Header/>

    <div class="order-container">
      <div class="container">
        <div class="order-header">
          <h1>确认订单</h1>
        </div>

        <div v-loading="loading" class="order-content">
          <!-- 订单商品 -->
          <div class="order-items">
            <h2>订单商品</h2>
            <div class="items-list">
              <div v-for="item in orderItems" :key="item.id" class="order-item">
                <div class="item-image">
                  <img :src="item.image" :alt="item.title"/>
                </div>
                <div class="item-info">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p class="item-venue">{{ item.venue }}</p>
                  <p class="item-time">{{ item.time }}</p>
                  <p class="item-session">场次：{{ item.session }}</p>
                </div>
                <div class="item-price">
                  <span class="price">¥{{ item.price }}</span>
                </div>
                <div class="item-quantity">
                  <span>x{{ item.quantity }}</span>
                </div>
                <div class="item-total">
                  <span class="total-price">¥{{ item.price * item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 联系人信息 -->
          <div class="contact-info">
            <h2>联系人信息</h2>
            <el-form
                ref="contactForm"
                :model="contactForm"
                :rules="contactRules"
                label-width="100px"
            >
              <el-form-item label="联系人" prop="name">
                <el-input v-model="contactForm.name" placeholder="请输入联系人姓名"/>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="contactForm.phone" placeholder="请输入手机号"/>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="contactForm.email" placeholder="请输入邮箱"/>
              </el-form-item>
            </el-form>
          </div>

          <!-- 支付方式 -->
          <div class="payment-method">
            <h2>支付方式</h2>
            <div class="payment-options">
              <el-radio-group v-model="paymentMethod">
                <el-radio label="alipay">
                  <i class="el-icon-money"></i>
                  支付宝
                </el-radio>
                <el-radio label="wechat">
                  <i class="el-icon-chat-dot-round"></i>
                  微信支付
                </el-radio>
                <el-radio label="unionpay">
                  <i class="el-icon-credit-card"></i>
                  银联支付
                </el-radio>
              </el-radio-group>
            </div>
          </div>

          <!-- 订单备注 -->
          <div class="order-remark">
            <h2>订单备注</h2>
            <el-input
                v-model="orderRemark"
                type="textarea"
                :rows="3"
                placeholder="请输入订单备注（选填）"
            />
          </div>

          <!-- 订单金额 -->
          <div class="order-amount">
            <div class="amount-item">
              <span>商品总额：</span>
              <span>¥{{ totalAmount }}</span>
            </div>
            <div class="amount-item">
              <span>服务费：</span>
              <span>¥{{ serviceFee }}</span>
            </div>
            <div class="amount-item total">
              <span>应付总额：</span>
              <span class="final-amount">¥{{ finalAmount }}</span>
            </div>
          </div>

          <!-- 提交订单 -->
          <div class="order-submit">
            <el-button
                type="primary"
                size="large"
                :loading="submitting"
                @click="submitOrder"
            >
              提交订单
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Header from '@/components/Header.vue'

export default {
  name: 'Order',
  components: {
    Header
  },
  data() {
    return {
      orderItems: [],
      contactForm: {
        name: '',
        phone: '',
        email: ''
      },
      contactRules: {
        name: [
          {required: true, message: '请输入联系人姓名', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ]
      },
      paymentMethod: 'alipay',
      orderRemark: '',
      submitting: false
    }
  },
  computed: {
    ...mapGetters('order', ['loading']),
    ...mapGetters('user', ['userInfo']),

    totalAmount() {
      return this.orderItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },

    serviceFee() {
      return Math.round(this.totalAmount * 0.05) // 5%服务费
    },

    finalAmount() {
      return this.totalAmount + this.serviceFee
    }
  },
  async mounted() {
    await this.loadOrderData()
  },
  methods: {
    ...mapActions('order', ['createOrder']),

    async loadOrderData() {
      const {showId, sessionId, from, items} = this.$route.query

      if (from === 'cart' && items) {
        // 从购物车来的订单
        this.orderItems = this.getCartItems(items.split(','))
      } else if (showId && sessionId) {
        // 直接购买的订单
        this.orderItems = [this.getDirectOrderItem(showId, sessionId)]
      } else {
        this.$message.error('订单信息不完整')
        this.$router.push('/')
        return
      }

      // 预填联系人信息
      if (this.userInfo) {
        this.contactForm.name = this.userInfo.name || ''
        this.contactForm.phone = this.userInfo.phone || ''
        this.contactForm.email = this.userInfo.email || ''
      }
    },

    getCartItems(itemIds) {
      // 这里应该从购物车获取商品信息
      // 暂时使用模拟数据
      return [
        {
          id: 1,
          title: '周杰伦2024巡回演唱会-北京站',
          venue: '北京工人体育馆',
          time: '2024-06-15 19:30',
          session: '2024-06-15 19:30',
          price: 580,
          quantity: 2,
          image: 'https://via.placeholder.com/100x100/ff6b35/ffffff?text=演唱会'
        },
        {
          id: 2,
          title: '经典话剧《雷雨》',
          venue: '国家大剧院',
          time: '2024-05-20 19:30',
          session: '2024-05-20 19:30',
          price: 180,
          quantity: 1,
          image: 'https://via.placeholder.com/100x100/4CAF50/ffffff?text=话剧'
        }
      ]
    },

    getDirectOrderItem(showId, sessionId) {
      // 这里应该根据showId和sessionId获取商品信息
      // 暂时使用模拟数据
      return {
        id: showId,
        title: '周杰伦2024巡回演唱会-北京站',
        venue: '北京工人体育馆',
        time: '2024-06-15 19:30',
        session: '2024-06-15 19:30',
        price: 580,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100/ff6b35/ffffff?text=演唱会'
      }
    },

    async submitOrder() {
      try {
        const valid = await this.$refs.contactForm.validate()
        if (!valid) return

        this.submitting = true

        const orderData = {
          items: this.orderItems,
          contact: this.contactForm,
          paymentMethod: this.paymentMethod,
          remark: this.orderRemark,
          totalAmount: this.totalAmount,
          serviceFee: this.serviceFee,
          finalAmount: this.finalAmount
        }

        const response = await this.createOrder(orderData)

        this.$message.success('订单提交成功')

        // 跳转到支付页面或订单详情页
        this.$router.push({
          path: '/user',
          query: {tab: 'orders'}
        })
      } catch (error) {
        this.$message.error(error.message || '订单提交失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
  background: $background-color-base;
}

.order-container {
  padding: 40px 0;
}

.order-header {
  margin-bottom: 30px;

  h1 {
    font-size: 32px;
    color: $text-primary;
    font-weight: bold;
  }
}

.order-content {
  display: grid;
  gap: 30px;
}

.order-items, .contact-info, .payment-method, .order-remark, .order-amount {
  background: #fff;
  border-radius: $border-radius-large;
  padding: 30px;
  box-shadow: $box-shadow-light;

  h2 {
    font-size: 20px;
    color: $text-primary;
    margin-bottom: 20px;
    font-weight: 600;
  }
}

.items-list {
  .order-item {
    display: grid;
    grid-template-columns: 100px 1fr 120px 80px 120px;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid $border-color-light;
    gap: 15px;

    &:last-child {
      border-bottom: none;
    }

    .item-image {
      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: $border-radius-base;
      }
    }

    .item-info {
      .item-title {
        font-size: $font-size-medium;
        color: $text-primary;
        margin-bottom: 8px;
        font-weight: 600;
        line-height: 1.4;
      }

      .item-venue, .item-time, .item-session {
        font-size: $font-size-small;
        color: $text-secondary;
        margin-bottom: 5px;
      }
    }

    .item-price {
      .price {
        color: $primary-color;
        font-size: $font-size-large;
        font-weight: bold;
      }
    }

    .item-quantity {
      text-align: center;
      color: $text-regular;
    }

    .item-total {
      .total-price {
        color: $primary-color;
        font-size: $font-size-large;
        font-weight: bold;
      }
    }
  }
}

.payment-options {
  .el-radio-group {
    display: flex;
    gap: 30px;

    .el-radio {
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        font-size: 18px;
      }
    }
  }
}

.order-amount {
  .amount-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid $border-color-light;

    &:last-child {
      border-bottom: none;
    }

    &.total {
      font-size: $font-size-large;
      font-weight: bold;
      color: $text-primary;

      .final-amount {
        color: $primary-color;
        font-size: $font-size-extra-large;
      }
    }
  }
}

.order-submit {
  text-align: center;

  .el-button {
    width: 200px;
    height: 50px;
    font-size: $font-size-medium;
    font-weight: 600;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .items-list {
    .order-item {
      grid-template-columns: 1fr;
      gap: 10px;
      text-align: center;

      .item-image {
        justify-self: center;
      }

      .item-quantity {
        order: 4;
      }

      .item-total {
        order: 5;
      }
    }
  }

  .payment-options {
    .el-radio-group {
      flex-direction: column;
      gap: 15px;
    }
  }
}
</style>
