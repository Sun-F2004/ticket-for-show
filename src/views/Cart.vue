<template>
  <div class="cart-page">
    <Header />
    
    <div class="cart-container">
      <div class="container">
        <div class="cart-header">
          <h1>我的购物车</h1>
          <p>共 {{ cartCount }} 件商品</p>
        </div>
        
        <div v-loading="loading" class="cart-content">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <i class="el-icon-shopping-cart-2"></i>
            <h3>购物车是空的</h3>
            <p>快去挑选心仪的演出吧</p>
            <el-button type="primary" @click="$router.push('/')">
              去购物
            </el-button>
          </div>
          
          <div v-else class="cart-items">
            <div class="cart-item" v-for="item in cartItems" :key="item.id">
              <div class="item-checkbox">
                <el-checkbox
                  v-model="item.selected"
                  @change="updateSelection"
                />
              </div>
              
              <div class="item-image">
                <img :src="item.image" :alt="item.title" />
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
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="10"
                  size="small"
                  @change="updateQuantity(item)"
                />
              </div>
              
              <div class="item-total">
                <span class="total-price">¥{{ item.price * item.quantity }}</span>
              </div>
              
              <div class="item-actions">
                <el-button
                  type="text"
                  size="small"
                  @click="removeItem(item.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
          
          <div v-if="cartItems.length > 0" class="cart-footer">
            <div class="cart-summary">
              <div class="summary-item">
                <span>已选择 {{ selectedCount }} 件商品</span>
              </div>
              <div class="summary-item">
                <span>总计：</span>
                <span class="total-amount">¥{{ totalAmount }}</span>
              </div>
            </div>
            
            <div class="cart-actions">
              <el-button @click="clearCart">清空购物车</el-button>
              <el-button type="primary" @click="checkout" :disabled="selectedCount === 0">
                结算 ({{ selectedCount }})
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Cart',
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'loading']),
    
    cartCount() {
      return this.cartItems.length
    },
    
    selectedCount() {
      return this.cartItems.filter(item => item.selected).length
    },
    
    totalAmount() {
      return this.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + (item.price * item.quantity), 0)
        .toFixed(2)
    }
  },
  async mounted() {
    await this.loadCart()
  },
  methods: {
    ...mapActions('cart', ['getCart', 'removeFromCart', 'updateCartItem', 'clearCart']),
    
    async loadCart() {
      try {
        await this.getCart()
      } catch (error) {
        console.error('加载购物车失败:', error)
        // 使用模拟数据
        this.$store.commit('cart/SET_CART_ITEMS', this.getMockCartItems())
      }
    },
    
    getMockCartItems() {
      return [
        {
          id: 1,
          title: '周杰伦2024巡回演唱会-北京站',
          venue: '北京工人体育馆',
          time: '2024-06-15 19:30',
          session: '2024-06-15 19:30',
          price: 580,
          quantity: 2,
          image: 'https://via.placeholder.com/100x100/ff6b35/ffffff?text=演唱会',
          selected: true
        },
        {
          id: 2,
          title: '经典话剧《雷雨》',
          venue: '国家大剧院',
          time: '2024-05-20 19:30',
          session: '2024-05-20 19:30',
          price: 180,
          quantity: 1,
          image: 'https://via.placeholder.com/100x100/4CAF50/ffffff?text=话剧',
          selected: true
        }
      ]
    },
    
    updateSelection() {
      // 更新选择状态
    },
    
    async updateQuantity(item) {
      try {
        await this.updateCartItem({
          itemId: item.id,
          quantity: item.quantity
        })
      } catch (error) {
        this.$message.error('更新数量失败')
      }
    },
    
    async removeItem(itemId) {
      try {
        await this.$confirm('确定要删除这个商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await this.removeFromCart(itemId)
        this.$message.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    
    async clearCart() {
      try {
        await this.$confirm('确定要清空购物车吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await this.clearCart()
        this.$message.success('购物车已清空')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('清空失败')
        }
      }
    },
    
    checkout() {
      const selectedItems = this.cartItems.filter(item => item.selected)
      if (selectedItems.length === 0) {
        this.$message.warning('请选择要结算的商品')
        return
      }
      
      this.$router.push({
        path: '/order',
        query: {
          from: 'cart',
          items: selectedItems.map(item => item.id).join(',')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: $background-color-base;
}

.cart-container {
  padding: 40px 0;
}

.cart-header {
  margin-bottom: 30px;
  
  h1 {
    font-size: 32px;
    color: $text-primary;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  p {
    color: $text-secondary;
    font-size: $font-size-base;
  }
}

.cart-content {
  background: #fff;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-light;
  overflow: hidden;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
  color: $text-secondary;
  
  i {
    font-size: 64px;
    margin-bottom: 20px;
    display: block;
  }
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: $text-primary;
  }
  
  p {
    font-size: $font-size-base;
    margin-bottom: 30px;
  }
}

.cart-items {
  .cart-item {
    display: grid;
    grid-template-columns: 50px 100px 1fr 120px 120px 120px 80px;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid $border-color-light;
    gap: 15px;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-checkbox {
      display: flex;
      justify-content: center;
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
    
    .item-total {
      .total-price {
        color: $primary-color;
        font-size: $font-size-large;
        font-weight: bold;
      }
    }
    
    .item-actions {
      display: flex;
      justify-content: center;
    }
  }
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: $background-color-light;
  border-top: 1px solid $border-color-light;
  
  .cart-summary {
    display: flex;
    gap: 30px;
    
    .summary-item {
      font-size: $font-size-base;
      color: $text-regular;
      
      .total-amount {
        color: $primary-color;
        font-size: $font-size-extra-large;
        font-weight: bold;
        margin-left: 10px;
      }
    }
  }
  
  .cart-actions {
    display: flex;
    gap: 15px;
    
    .el-button {
      height: 40px;
      padding: 0 20px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .cart-items {
    .cart-item {
      grid-template-columns: 1fr;
      gap: 10px;
      text-align: center;
      
      .item-checkbox {
        order: 1;
      }
      
      .item-image {
        order: 2;
      }
      
      .item-info {
        order: 3;
      }
      
      .item-price {
        order: 4;
      }
      
      .item-quantity {
        order: 5;
        justify-self: center;
      }
      
      .item-total {
        order: 6;
      }
      
      .item-actions {
        order: 7;
      }
    }
  }
  
  .cart-footer {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    
    .cart-summary {
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style> 