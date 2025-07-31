<template>
  <div class="home">
    <Header/>

    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px" indicator-position="outside">
        <el-carousel-item v-for="show in hotShows" :key="show.id">
          <div class="banner-item" :style="{ backgroundImage: `url(${show.mainImageUrl})`}">
            <div class="banner-content">
              <h2>{{ show.name }}</h2>
              <el-button type="primary" size="large" @click="goToShow(show.id)">
                立即购票
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类导航 -->
    <div class="category-section">
      <div class="container">
        <div class="category-grid">
          <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              @click="goToCategory(category.id)"
          >
            <i :class="category.icon"></i>
            <span>{{ category.categoryName }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门演出 -->
    <div class="section">
      <div class="container">
        <div class="section-header">
          <h2>热门演出</h2>
        </div>

        <div v-loading="loading" class="show-grid">
          <div
              v-for="show in hotShows"
              :key="show.id"
              class="show-card"
              @click="goToShow(show.id)"
          >
            <div class="show-image">
              <img :src="show.mainImageUrl" :alt="show.name"/>
              <div class="show-tags">
                <span v-if="show.isHot" class="tag tag-hot">热门</span>
                <span v-if="show.isNew" class="tag tag-new">新品</span>
              </div>
            </div>
            <div class="show-info">
              <h3 class="show-title">{{ show.name }}</h3>
              <p class="show-venue">{{ show.position }}</p>
              <p class="show-time">{{ show.startTime }}</p>
              <div class="show-price">
                <span class="price">¥{{ show.prices[0] }}</span>
                <span class="price-desc">起</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐演出 -->
    <div class="section">
      <div class="container">
        <div class="section-header">
          <h2>为您推荐</h2>
        </div>

        <div v-loading="loading" class="show-grid">
          <div
              v-for="show in recommendedShows"
              :key="show.id"
              class="show-card"
              @click="goToShow(show.id)"
          >
            <div class="show-image">
              <img :src="show.mainImageUrl" :alt="show.name"/>
              <div class="show-tags">
                <span v-if="show.isHot" class="tag tag-hot">热门</span>
                <span v-if="show.isNew" class="tag tag-new">新品</span>
              </div>
            </div>
            <div class="show-info">
              <h3 class="show-title">{{ show.name }}</h3>
              <p class="show-venue">{{ show.position }}</p>
              <p class="show-time">{{ show.startTime }}</p>
              <div class="show-price">
                <span class="price">¥{{ show.prices[0] }}</span>
                <span class="price-desc">起</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新演出 -->
    <div class="section">
      <div class="container">
        <div class="section-header">
          <h2>最新演出</h2>
        </div>

        <div v-loading="loading" class="show-grid">
          <div
              v-for="show in latestShows"
              :key="show.id"
              class="show-card"
              @click="goToShow(show.id)"
          >
            <div class="show-image">
              <img :src="show.mainImageUrl" :alt="show.name"/>
              <div class="show-tags">
                <span v-if="show.isHot" class="tag tag-hot">热门</span>
                <span v-if="show.isNew" class="tag tag-new">新品</span>
              </div>
            </div>
            <div class="show-info">
              <h3 class="show-title">{{ show.name }}</h3>
              <p class="show-venue">{{ show.position }}</p>
              <p class="show-time">{{ show.startTime }}</p>
              <div class="show-price">
                <span class="price">¥{{ show.prices[0] }}</span>
                <span class="price-desc">起</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {getCategory, getEvent} from '@/api/event'
import Header from '@/components/Header.vue'

export default {
  name: 'Home',
  components: {
    Header
  },
  data() {
    return {
      loading: false,
      hotShows: [],
      recommendedShows: [],
      latestShows: []
    }
  },
  computed: {
    ...mapState('user', ['categories']),
  },
  async mounted() {
    await this.loadShows()
    await this.loadCategories()
  },
  methods: {
    ...mapMutations('user', ['SET_CATEGORIES']),

    async loadCategories() {
      if (this.categories.length) return
      const {content} = await getCategory()
      this.SET_CATEGORIES(content)
    },

    async loadShows() {
      try {
        if (this.loading) return
        this.loading = true
        // 获取热门演出
        const hotRes = await getEvent(1, 4, "广州市")
        this.hotShows = hotRes.list

        // 获取推荐演出
        const recommendRes = await getEvent(1, 4, null, 3)
        this.recommendedShows = recommendRes.list

        // 获取最新演出
        let date = new Date()
        const y = date.getFullYear()
        const m = (date.getMonth() + 1).toString().padStart(2, '0')
        const d = date.getDate().toString().padStart(2, '0')
        const latestRes = await getEvent(1, 4, null, null, `${y}-${m}-${d}`)
        this.latestShows = latestRes.list.sort((a, b) => {
          return Date.parse(b.startTime.split('T')[0]) - Date.parse(a.startTime.split('T')[0])
        })
      } catch (error) {
        console.error('加载演出数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    goToShow(showId) {
      this.$router.push(`/show/${showId}`).catch(err => {
      })
    },

    goToCategory(category) {
      // 跳转到分类页面，传递分类ID
      this.$router.push({path: '/category', query: {id: category}})
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  padding-bottom: 5vh;
}

.banner-section {
  margin-bottom: 40px;

  .banner-item {
    height: 400px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
    }

    .banner-content {
      position: relative;
      z-index: 1;
      color: #fff;
      text-align: center;
      width: 100%;
      padding: 0 20px;

      h2 {
        font-size: 36px;
        margin-bottom: 15px;
        font-weight: bold;
      }

      p {
        font-size: 18px;
        margin-bottom: 30px;
        opacity: 0.9;
      }
    }
  }
}

.category-section {
  margin-bottom: 40px;

  .category-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 20px;
  }

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 10px;
    background: #fff;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-light;
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      transform: translateY(-5px);
      box-shadow: $box-shadow-dark;
    }

    i {
      font-size: 32px;
      color: $primary-color;
      margin-bottom: 10px;
    }

    span {
      font-size: $font-size-base;
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.section {
  margin-bottom: 60px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    h2 {
      font-size: 28px;
      color: $text-primary;
      font-weight: bold;
    }

    .more-link {
      color: $primary-color;
      text-decoration: none;
      font-size: $font-size-base;
      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
      }

      i {
        margin-left: 5px;
      }
    }
  }

  .show-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .show-card {
    background: #fff;
    border-radius: $border-radius-large;
    overflow: hidden;
    box-shadow: $box-shadow-light;
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      transform: translateY(-5px);
      box-shadow: $box-shadow-dark;
    }

    .show-image {
      position: relative;
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: $transition-base;
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
      padding: 15px;

      .show-title {
        font-size: $font-size-medium;
        color: $text-primary;
        margin-bottom: 8px;
        font-weight: 600;
        line-height: 1.4;
        height: 44px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .show-venue {
        font-size: $font-size-small;
        color: $text-secondary;
        margin-bottom: 5px;
      }

      .show-time {
        font-size: $font-size-small;
        color: $text-secondary;
        margin-bottom: 10px;
      }

      .show-price {
        display: flex;
        align-items: baseline;

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
}
</style>
