<template>
  <div class="show-detail">
    <Header/>

    <div class="detail-container">
      <div class="container">
        <div v-loading="loading" class="detail-content">
          <!-- 面包屑导航
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/category/${showDetail.category}` }">
              {{ getCategoryName(showDetail.category) }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ showDetail.title }}</el-breadcrumb-item>
          </el-breadcrumb> -->

          <!-- 演出基本信息 -->
          <div class="show-info-section">
            <div class="show-image">
              <img :src="showDetail.mainImageUrl" :alt="showDetail.name"/>
              <!-- <div class="show-tags">
                <span v-if="showDetail.isHot" class="tag tag-hot">热门</span>
                <span v-if="showDetail.isNew" class="tag tag-new">新品</span>
              </div> -->
            </div>

            <div class="show-info">
              <h1 class="show-title">{{ showDetail.name }}</h1>
              <div class="show-meta">
                <div class="meta-item">
                  <i class="el-icon-location"></i>
                  <span>场馆：{{ showDetail.position }}</span>
                </div>
                <div class="meta-item">
                  <i class="el-icon-time"></i>
                  <span>时间：{{ showDetail.startTime }}</span>
                </div>
                <div class="meta-item">
                  <i class="el-icon-tickets"></i>
                  <span>票价：¥{{ minPrice }} - ¥{{ maxPrice }}</span>
                </div>
              </div>

              <!-- <div class="show-description">
                <h3>演出介绍</h3>
                <img :src="showDetail.mainImageUrl" :alt="showDetail.mainImageUrl" />
              </div> -->

              <div class="show-actions">
                <el-button type="primary" size="large" @click="goToBooking">
                  <i class="el-icon-tickets"></i>
                  立即购票
                </el-button>
                <el-button size="large" @click="addToCart">
                  <i class="el-icon-shopping-cart-2"></i>
                  加入购物车
                </el-button>
                <el-button size="large" @click="toggleFavorite">
                  <i :class="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                  {{ isFavorite ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 场次选择 -->
          <div class="sessions-section">
            <h2>选择场次</h2>
            <div class="sessions-list">
              <div
                  v-for="session in sessions"
                  :key="session.id"
                  class="session-item"
                  :class="{ active: selectedSession?.id === session.id }"
                  @click="selectSession(session)"
              >
                <div class="session-info">
                  <div class="session-time">{{ session.startTime }}</div>
                  <div class="session-venue">{{ session.venueName }}</div>
                </div>
                <div class="session-price">
                  <span class="price">¥{{ session.minPrice }}</span>
                  <span class="price-desc">起</span>
                </div>
                <div class="session-status">
                  <el-tag v-if="session.status === 'selling'" type="success">售票中</el-tag>
                  <el-tag v-else-if="session.status === 'soldout'" type="danger">已售罄</el-tag>
                  <el-tag v-else type="info">即将开售</el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- 座位选择 -->
          <!-- <div v-if="selectedSession" class="seats-section">
            <h2>选择座位</h2>
            <div class="seats-container">
              <div class="stage">舞台</div>
              <div class="seats-map"> -->
                <!-- 这里可以集成座位选择组件 -->
                <!-- <div class="seats-placeholder">
                  <i class="el-icon-tickets"></i>
                  <p>座位选择功能开发中</p>
                  <p>请点击"立即购票"进入购票流程</p>
                </div>
              </div>
            </div>
          </div> -->

          <!-- 演出详情 -->
          <div class="detail-tabs">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="演出详情" name="detail">
                <div class="detail-content">
                  <img :src="showDetail.description" :alt="showDetail.name" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="购票须知" name="notice">
                <div class="notice-content">
                  <h3>购票须知</h3>
                  <ul>
                    <li>请携带有效身份证件入场</li>
                    <li>演出开始前30分钟开始检票</li>
                    <li>演出期间请保持安静，关闭手机</li>
                    <li>禁止携带食品、饮料入场</li>
                    <li>演出票一经售出，概不退换</li>
                  </ul>
                </div>
              </el-tab-pane>
              <el-tab-pane label="退换政策" name="refund">
                <div class="refund-content">
                  <h3>退换政策</h3>
                  <ul>
                    <li>演出开始前7天可申请退票</li>
                    <li>退票需收取10%手续费</li>
                    <li>演出开始前7天内不支持退票</li>
                    <li>因不可抗力因素取消演出，全额退款</li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import { getEventInfo, getSession } from '@/api/event'
import Header from '@/components/Header.vue'

export default {
  name: 'ShowDetail',
  components: {
    Header
  },
  data() {
    return {
      showDetail: {},
      minPrice: '',
      maxPrice: '',
      sessions: [],
      selectedSession: null,
      isFavorite: false,
      activeTab: 'detail'
    }
  },
  computed: {
    ...mapGetters('show', ['loading'])
  },
  async mounted() {
    const showId = this.$route.params.id
    await this.loadShowDetail(showId)
    await this.loadSessions(showId)
    this.minPrice = Math.min(this.showDetail.tickets[0].price, this.showDetail.tickets[1].price)
    this.maxPrice = Math.max(this.showDetail.tickets[0].price, this.showDetail.tickets[1].price)
  },
  methods: {
    ...mapActions('show', ['getShowDetail', 'getShowSessions']),
    ...mapActions('cart', ['addToCart']),

    async loadShowDetail(showId) {
      try {
        const response = await getEventInfo(this.$route.params.id)
        this.showDetail = response.content
      } catch (error) {
        console.error('加载演出详情失败:', error)
        this.showDetail = this.getMockShowDetail()
      }
    },

    async loadSessions(showId) {
      try {
        const response = await getSession(this.$route.params.id)
        this.sessions = response.content
        if (this.sessions.length > 0) {
          this.selectedSession = this.sessions[0]
        }
      } catch (error) {
        console.error('加载场次信息失败:', error)
        this.sessions = this.getMockSessions()
        if (this.sessions.length > 0) {
          this.selectedSession = this.sessions[0]
        }
      }
    },

    getMockShowDetail() {
      return {
        id: this.$route.params.id,
        title: '周杰伦2024巡回演唱会-北京站',
        venue: '北京工人体育馆',
        time: '2024-06-15 19:30',
        artist: '周杰伦',
        minPrice: 380,
        maxPrice: 1280,
        image: 'https://via.placeholder.com/400x300/ff6b35/ffffff?text=周杰伦演唱会',
        description: '地表最强，王者归来！周杰伦2024巡回演唱会震撼来袭，带你重温经典，感受音乐的魅力。',
        category: 'concert',
        isHot: true,
        isNew: false,
        detailContent: '<p>演出详情内容...</p>'
      }
    },

    getMockSessions() {
      return [
        {
          id: 1,
          time: '2024-06-15 19:30',
          venue: '北京工人体育馆',
          minPrice: 380,
          maxPrice: 1280,
          status: 'selling'
        },
        {
          id: 2,
          time: '2024-06-16 19:30',
          venue: '北京工人体育馆',
          minPrice: 380,
          maxPrice: 1280,
          status: 'selling'
        }
      ]
    },

    getCategoryName(category) {
      const categoryMap = {
        concert: '演唱会',
        drama: '话剧',
        musical: '音乐剧',
        opera: '戏曲',
        children: '儿童剧',
        exhibition: '展览'
      }
      return categoryMap[category] || '演出'
    },

    selectSession(session) {
      this.selectedSession = session
    },

    goToBooking() {
      if (!this.selectedSession) {
        this.$message.warning('请先选择场次')
        return
      }
      this.$router.push({
        path: '/order',
        query: {
          // showId: this.showDetail.id,
          // sessionId: this.selectedSession.id
            showDetail: this.showDetail,
            sessionId: this.selectedSession.id
        }
      })
    },

    async addToCart() {
      if (!this.selectedSession) {
        this.$message.warning('请先选择场次')
        return
      }

      try {
        await this.addToCart({
          showId: this.showDetail.id,
          sessionId: this.selectedSession.id,
          quantity: 1
        })
        this.$message.success('已添加到购物车')
      } catch (error) {
        this.$message.error('添加到购物车失败')
      }
    },

    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      this.$message.success(this.isFavorite ? '已收藏' : '已取消收藏')
    }
  }
}
</script>

<style lang="scss" scoped>
.show-detail {
  min-height: 100vh;
  background: $background-color-base;
}

.detail-container {
  padding: 40px 0;
}

.breadcrumb {
  margin-bottom: 30px;
}

.show-info-section {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  margin-bottom: 40px;
  background: #fff;
  border-radius: $border-radius-large;
  padding: 30px;
  box-shadow: $box-shadow-light;
}

.show-image {
  position: relative;

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: $border-radius-base;
  }

  .show-tags {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 5px;
  }
}

.show-info {
  .show-title {
    font-size: 28px;
    color: $text-primary;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .show-meta {
    margin-bottom: 20px;

    .meta-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      i {
        color: $primary-color;
        margin-right: 10px;
        width: 16px;
      }

      span {
        color: $text-regular;
        font-size: $font-size-base;
      }
    }
  }

  .show-description {
    margin-bottom: 30px;

    h3 {
      font-size: $font-size-large;
      color: $text-primary;
      margin-bottom: 10px;
    }

    p {
      color: $text-regular;
      line-height: 1.6;
    }
  }

  .show-actions {
    display: flex;
    gap: 15px;

    .el-button {
      flex: 1;
      height: 45px;

      i {
        margin-right: 5px;
      }
    }
  }
}

.sessions-section {
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

  .sessions-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .session-item {
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

    .session-info {
      .session-time {
        font-size: $font-size-medium;
        color: $text-primary;
        font-weight: 600;
        margin-bottom: 5px;
      }

      .session-venue {
        font-size: $font-size-small;
        color: $text-secondary;
      }
    }

    .session-price {
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

.seats-section {
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

  .seats-container {
    .stage {
      text-align: center;
      background: $primary-color;
      color: #fff;
      padding: 10px;
      border-radius: $border-radius-base;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .seats-map {
      .seats-placeholder {
        text-align: center;
        padding: 60px 20px;
        color: $text-secondary;

        i {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }

        p {
          margin: 10px 0;
          font-size: $font-size-base;
        }
      }
    }
  }
}

.detail-tabs {
  background: #fff;
  border-radius: $border-radius-large;
  padding: 30px;
  box-shadow: $box-shadow-light;

  .detail-content, .notice-content, .refund-content {
    h3 {
      font-size: $font-size-large;
      color: $text-primary;
      margin-bottom: 15px;
    }

    ul {
      padding-left: 20px;

      li {
        margin-bottom: 10px;
        color: $text-regular;
        line-height: 1.6;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .show-info-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .show-actions {
    flex-direction: column;
  }

  .session-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
