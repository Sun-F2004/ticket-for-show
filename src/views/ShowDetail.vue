<template>
  <div class="show-detail">
    <Header/>

    <div class="detail-container">
      <div class="container">
        <div v-loading="loading" class="detail-content">
          <!-- 演出基本信息 -->
          <div class="show-info-section">
            <div class="show-image">
              <img :src="showDetail.mainImageUrl" :alt="showDetail.name"/>
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

              <div class="show-actions">
                <el-button type="primary" size="large" @click="goToBooking">
                  <i class="el-icon-tickets"></i>
                  立即购票
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

          <!-- 演出详情 -->
          <div class="detail-tabs">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="演出详情" name="detail">
                <el-image class="detail-content" :src="showDetail.description" fit="cover">
                </el-image>
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
import {getEventInfo, getSession} from '@/api/event'
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

  async mounted() {
    const showId = this.$route.params.id
    await this.loadShowDetail(showId)
    await this.loadSessions(showId)
    this.minPrice = Math.min(this.showDetail.tickets[0].price, this.showDetail.tickets[1].price)
    this.maxPrice = Math.max(this.showDetail.tickets[0].price, this.showDetail.tickets[1].price)
  },
  methods: {

    async loadShowDetail(showId) {
      try {
        const response = await getEventInfo(this.$route.params.id)
        this.showDetail = response.content
      } catch (error) {
        console.error('加载演出详情失败:', error)
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
        if (this.sessions.length > 0) {
          this.selectedSession = this.sessions[0]
        }
      }
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
</style>
