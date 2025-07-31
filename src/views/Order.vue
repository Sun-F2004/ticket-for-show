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
              <div v-for="item in showDetails" :key="item.id" class="order-item">
                <div class="item-image">
                  <img :src="item.mainImageUrl" :alt="item.name"/>
                </div>
                <div class="item-info">
                  <h3 class="item-title">{{ item.name }}</h3>
                  <p class="item-venue">{{ item.position }}</p>
                  <p class="item-time">{{ item.startTime }}</p>
                  <p class="item-session">场次：{{ session.sessionName }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 票 -->
          <div class="ticket-section">
            <h2>选择票</h2>
            <div class="ticket-list">
              <div
                  v-for="ticket in tickets"
                  :key="ticket.id"
                  class="ticket-item"
                  :class="{ active: selectedTicket?.id === ticket.id }"
                  @click="selectTicket(ticket)"
              >
                <div class="ticket-info">
                  <div class="ticket-name">{{ ticket.tierName }}</div>
                </div>
                <div class="ticket-price">
                  <span class="price">¥{{ ticket.price }}</span>
                  <span class="price-desc">起</span>
                </div>
                <div class="ticket-status">
                  <el-tag type="success">售票中</el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- 观演人选择 -->
          <div class="audience-section">
            <h2>选择观演人</h2>
            <div class="audience-list">
              <div
                  v-for="audience in passengers"
                  :key="audience.id"
                  class="audience-item"
                  :class="{ active: selectedAudience.includes(audience.id) }"
                  @click="selectAudience(audience.id)"
              >
                <div class="audience-info">
                  <div class="audience-name">{{ audience.name }}</div>
                </div>
              </div>
              <div v-if="!passengers.length" class="audience-name">
                请前去用户中心添加观演人！
              </div>
            </div>
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
          <el-dialog
              title="扫码支付"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
            <span slot="footer" class="dialog-footer">
              <img src="/ma.jpg" style="max-width: 100%; height: auto;" />
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Header from '@/components/Header.vue'
import {getPassengers} from '@/api/user'
import {confirm, pay} from '@/api/order'

export default {
  name: 'Order',
  components: {
    Header
  },
  data() {
    return {
      dialogVisible: false,
      showDetails: [],
      passengers: [],
      tickets: [],
      selectedTicket: {},
      selectedAudience: [],
      sessionId: '',
      session: {},
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
      submitting: false,
      passengerSelectList: [
        {id: Date.now(), value: null}
      ],
    }
  },
  computed: {
    ...mapGetters('order', ['loading']),
    ...mapGetters('user', ['userInfo', 'passengers']),

    totalAmount() {
      return this.selectedAudience.length * this.selectedTicket.price
    },

    serviceFee() {
      return Math.round(this.totalAmount * 0.05) // 5%服务费
    },

    finalAmount() {
      return this.totalAmount + this.serviceFee
    },
  },
  async mounted() {
    await this.loadOrderData()
    await this.getPassengers()
    this.$store.dispatch('user/getPassengers')
  },
  methods: {
    ...mapActions('order', ['createOrder']),

    async getPassengers() {
      const {content} = await getPassengers()
      this.passengers = content
    },

    async loadOrderData() {
      const {showDetail, sessionId} = this.$route.query
      this.showDetails.push(showDetail)
      this.sessionId = sessionId
      for (const session of showDetail.sessions) {
        if (session.id == sessionId) {
          this.session = session
        }
      }
      console.log(showDetail)
      for (const ticket of showDetail.tickets) {
        if (ticket.sessionId == this.sessionId) {
          this.tickets.push(ticket)
        }
      }
    },

    selectTicket(ticket) {
      this.selectedTicket = ticket
    },

    selectAudience(id) {
      let index = this.selectedAudience.indexOf(id)
      if (index !== -1) {
        this.selectedAudience.splice(index, 1)
      } else {
        this.selectedAudience.push(id)
      }
    },

    async submitOrder() {
      try {
        // const valid = await this.$refs.contactForm.validate()
        // if (!valid) return

        // 校验观演人选择
        if (this.selectedAudience.length === 0) {
          this.$message.error('请至少添加一位观演人')
          return
        }

        this.submitting = true

        const orderData = {
          audienceId: this.selectedAudience,
          eventName: this.showDetails[0].name,
          sessionId: this.sessionId,
          sessionName: this.session.sessionName,
          tierName: this.selectedTicket.tierName,
          quantity: this.selectedAudience.length
        }
        const response = await confirm(orderData)
        const payData = {
          ids: response.content,
          sessionId: this.sessionId,
          tierName: this.selectedTicket.tierName
        }
        this.dialogVisible = true
        setTimeout(async () => {
          this.dialogVisible = false
          try {
            const payResponse = await pay(payData)
            this.$message.success("已支付,订单处理中")
            this.$router.push({
              path: '/user',
              query: {tab: 'orders'}
            })
          } catch (e) {
            this.$message.error("支付失败")
          }
        }, 5000)
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

.ticket-section {
  background: #fff;
  border-radius: $border-radius-large;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: $box-shadow-light;

  h2 {
    font-size: 24px;
    color: $text-primary;
    margin-bottom: 20px;
  }

  .ticket-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .ticket-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border: 2px solid $border-color-light;
    border-radius: $border-radius-base;
    cursor: pointer;
    transition: $transition-base;

    &:hover, &.active {
      border-color: $primary-color;
      background: rgba($primary-color, 0.05);
    }

    .ticket-info {
      .session-time {
        font-size: $font-size-medium;
        color: $text-primary;
        font-weight: 600;
        margin-bottom: 5px;
      }

      .ticket-name {
        font-size: $font-size-small;
        color: $text-secondary;
      }
    }

    .ticket-price {
      .price {
        color: $primary-color;
        font-size: $font-size-large;
        font-weight: bold;
      }

      .price-desc {
        color: $text-secondary;
        font-size: $font-size-small;
        margin-left: 5px;
      }
    }
  }
}

.audience-section {
  background: #fff;
  border-radius: $border-radius-large;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: $box-shadow-light;

  h2 {
    font-size: 24px;
    color: $text-primary;
    margin-bottom: 20px;
  }

  .audience-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .audience-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border: 2px solid $border-color-light;
    border-radius: $border-radius-base;
    cursor: pointer;
    transition: $transition-base;

    &.active {
      border-color: $primary-color;
      background: rgba($primary-color, 0.05);
    }

    .audience-info {
      .ticket-name {
        font-size: $font-size-small;
        color: $text-secondary;
      }
    }
  }
}


</style>
