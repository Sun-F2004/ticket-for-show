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
              <h3>{{ userInfo.account || '用户' }}</h3>
              <p>{{ userInfo.phoneNumber }}</p>
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
              <el-menu-item index="passenger">
                <i class="el-icon-s-custom"></i>
                <span>观演人管理</span>
              </el-menu-item>
            </el-menu>
          </div>

          <!-- 主内容区 -->
          <div class="user-main">
            <!-- 个人资料 -->
            <div v-if="activeMenu === 'profile'" class="profile-section">
              <h2>个人资料</h2>
              <el-form
                  :model="userInfo"
                  :rules="userInfoRules"
                  label-width="100px"
              >
                <el-form-item label="用户名" prop="account">
                  <el-input v-model="userInfo.account"/>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                  <el-input v-model="userInfo.realName"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumber">
                  <el-input v-model="userInfo.phoneNumber"/>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="userInfo.gender">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                  <el-date-picker
                      v-model="userInfo.birthday"
                      type="date"
                      placeholder="选择生日"
                  />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="userInfo.password" type="password" show-password/>
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
                  <el-tab-pane label="全部" name=""/>
                  <el-tab-pane label="待支付" name="P"/>
                  <el-tab-pane label="处理中" name="G"/>
                  <el-tab-pane label="已支付" name="D"/>
                  <el-tab-pane label="已取消" name="C"/>
                  <el-tab-pane label="已完成" name="O"/>
                </el-tabs>
              </div>

              <div v-loading="orderLoading" class="orders-list">
                <div v-for="order in orderList" :key="order.id" class="order-item">
                  <div class="order-header">
                    <span class="order-number">订单号：{{ order.orderNumber }}</span>
                    <span class="order-status">{{ getOrderStatusText(order.status) }}</span>
                  </div>
                  <div class="order-content">
                    <div :key="order.id" class="order-product">
                      <!-- <img :src="item.image" :alt="item.title"/> -->
                      <div class="product-info">
                        <h4>{{ order.eventName }}</h4>
                        <p>{{ order.tierName }} | {{ order.startTime }}</p>
                        <p>数量：{{ order.quantity }}</p>
                      </div>
                      <div class="product-price">
                        <span>¥{{ order.unitPrice }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="order-footer">
                    <div class="order-total">
                      总计：<span class="total-price">¥{{ order.unitPrice * order.quantity }}</span>
                    </div>
                    <div class="order-actions">
                      <el-button v-if="order.status === 'unpaid'" type="primary" size="small">
                        立即付款
                      </el-button>
                      <el-button v-if="order.status === 'unpaid'" size="small" @click="cancelOrder(order.id)">
                        取消订单
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pagination-bar" v-if="total > pageSize">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="pageSize"
                    :current-page.sync="currentPage"
                    @current-change="onPageChange"
                />
              </div>
            </div>

            <!-- 观演人管理 -->
            <div v-if="activeMenu === 'passenger'" class="passenger-section">
              <h2>观演人管理</h2>
              <el-button type="primary" @click="showAddPassenger = true" style="margin-bottom: 20px;">添加观演人
              </el-button>
              <el-table :data="passengers" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="120"/>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="deletePassengerConfirm(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 添加/编辑观演人弹窗 -->
              <el-dialog :title="editPassengerData ? '编辑观演人' : '添加观演人'" :visible.sync="showAddPassenger">
                <el-form :model="passengerForm" :rules="passengerRules" ref="passengerForm" label-width="100px">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="passengerForm.name"/>
                  </el-form-item>
                  <el-form-item label="证件号码" prop="idCardNumber">
                    <el-input v-model="passengerForm.idCardNumber"/>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="showAddPassenger = false">取 消</el-button>
                  <el-button type="primary" @click="submitPassenger">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import {addPassenger, deletePassenger, getPassengers, updateUserInfo} from '@/api/user'
import {orderPage} from '@/api/order'
import {mapActions} from "vuex";

export default {
  name: 'UserCenter',
  components: {
    Header
  },
  data() {
    return {
      activeMenu: 'profile',
      orderTab: '',
      orderLoading: false,
      currentStatus: "",
      userInfo: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      userInfoRules: {
        realName: [
          {required: true, message: '请输入真名', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        phoneNumber: [
          {required: true, message: '请输入电话号码', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
      },
      orderList: [],
      favorites: [],
      addresses: [],
      passengers: [],
      showAddPassenger: false,
      passengerForm: {
        name: '',
        idCardNumber: '',
      },
      passengerRules: {
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        idCardNumber: [{required: true, message: '请输入证件号码', trigger: 'blur'}],
      },
      editPassengerData: null
    }
  },
  watch: {
    $route(to) {
      const tab = to.query.tab
      if (tab) {
        this.activeMenu = tab
      }
    }
  },
  async mounted() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeMenu = tab
    }
    await this.fetchOrder()
    this.passengers = await this.getPassengers()
    this.userInfo = await this.getUserInfo()
  },
  methods: {
    ...mapActions('user', ['getUserInfo', 'getPassengers']),

    onPageChange(page) {
      this.currentPage = page
      this.fetchOrder(this.currentStatus)
    },


    handleMenuSelect(key) {
      if (this.activeMenu === key) return
      this.activeMenu = key
      this.$router.push({query: {tab: key}})
    },

    async fetchOrder(status) {
      this.orderLoading = true
      try {
        this.currentStatus = status
        const data = {
          current: this.currentPage,
          size: this.pageSize,
          status: this.currentStatus
        }
        const res = await orderPage(data)
        this.orderList = res.list
        this.total = res.total
      } catch (error) {
        console.log(error)
      } finally {
        this.orderLoading = false
      }

    },

    // async loadOrders() {
    //   this.orderLoading = true
    //   try {
    //     const response = await this.getOrderList({status: this.orderTab})
    //     this.orderList = response.data || this.getMockOrders()
    //   } catch (error) {
    //     console.error('加载订单失败:', error)
    //     this.orderList = this.getMockOrders()
    //   } finally {
    //     this.orderLoading = false
    //   }
    // },

    getOrderStatusText(status) {
      const statusMap = {
        P: '待支付',
        G: '处理中',
        D: '已支付',
        C: '已取消',
        O: '已完成'
      }
      return statusMap[status] || status
    },

    async updateProfile() {
      try {
        await updateUserInfo(this.userInfo)
        this.$message.success('个人资料更新成功')
        this.userInfo = await this.getUserInfo()
      } catch (error) {
        this.$message.error('更新失败')
      }
    },

    handleOrderTabClick() {
      console.log("tab" + this.orderTab)
      this.fetchOrder(this.orderTab)
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

    async loadPassengers() {
      const res = await getPassengers()
      this.passengers = res.content
    },
    editPassenger(row) {
      this.editPassengerData = row
      this.passengerForm = {...row}
      this.showAddPassenger = true
    },
    deletePassengerConfirm(id) {
      this.$confirm('确定要删除该观演人吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePassenger({id: id}).then(async () => {
          this.$message.success('删除成功')
          const res = await getPassengers()
          this.passengers = res.content
        })
      })
    },
    submitPassenger() {
      this.$refs.passengerForm.validate(async valid => {
        if (!valid) return
        if (this.editPassengerData) {
          await this.updatePassenger(this.passengerForm)
          this.$message.success('编辑成功')
        } else {
          await addPassenger(this.passengerForm)
          this.$message.success('添加成功')
          this.loadPassengers()
        }
        this.showAddPassenger = false
        this.editPassengerData = null
        this.passengerForm = {name: '', idCardNumber: ''}
      })
    },
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

.passenger-section {
  .el-table {
    border: 1px solid $border-color-light;
    border-radius: $border-radius-base;
    overflow: hidden;
  }

  .el-button {
    margin-right: 10px;
  }
}
</style>
