<template>
  <div class="home">
    <Header/>

    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px" indicator-position="outside">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.description }}</p>
              <el-button type="primary" size="large" @click="goToShow(banner.showId)">
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
              @click="goToCategory(category)"
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
          <router-link to="/category/hot" class="more-link">查看更多 <i class="el-icon-arrow-right"></i></router-link>
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
                <span class="price">¥{{ show.minPrice }}</span>
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
          <router-link to="/category/recommended" class="more-link">查看更多 <i class="el-icon-arrow-right"></i>
          </router-link>
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
                <span class="price">¥{{ show.minPrice }}</span>
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
          <router-link to="/category/latest" class="more-link">查看更多 <i class="el-icon-arrow-right"></i>
          </router-link>
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
                <span class="price">¥{{ show.minPrice }}</span>
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
import {mapActions, mapGetters} from 'vuex'
import {getCategory, getEvent} from '@/api/event'
import Header from '@/components/Header.vue'

export default {
  name: 'Home',
  components: {
    Header
  },
  data() {
    return {
      banners: [
        {
          id: 1,
          title: '周杰伦2024巡回演唱会',
          description: '地表最强，王者归来',
          image: 'https://via.placeholder.com/1200x400/ff6b35/ffffff?text=周杰伦演唱会',
          showId: 1
        },
        {
          id: 2,
          title: '经典话剧《雷雨》',
          description: '曹禺经典作品，震撼上演',
          image: 'https://via.placeholder.com/1200x400/4CAF50/ffffff?text=雷雨话剧',
          showId: 2
        },
        {
          id: 3,
          title: '儿童剧《小王子》',
          description: '童话世界，童心未泯',
          image: 'https://via.placeholder.com/1200x400/2196F3/ffffff?text=小王子儿童剧',
          showId: 3
        }
      ],
      // categories: [
      //   {id: 1, name: '演唱会', icon: 'el-icon-microphone', path: '/category/concert'},
      //   {id: 2, name: '话剧', icon: 'el-icon-video-camera', path: '/category/drama'},
      //   {id: 3, name: '音乐剧', icon: 'el-icon-headset', path: '/category/musical'},
      //   {id: 4, name: '戏曲', icon: 'el-icon-trophy', path: '/category/opera'},
      //   {id: 5, name: '儿童剧', icon: 'el-icon-star-on', path: '/category/children'},
      //   {id: 6, name: '展览', icon: 'el-icon-picture', path: '/category/exhibition'},
      //   {id: 7, name: '音乐会', icon: 'el-icon-service', path: '/category/classical'},
      //   {id: 8, name: '舞蹈', icon: 'el-icon-user', path: '/category/dance'}
      // ],
      categories: [],
      hotShows: [],
      recommendedShows: [],
      latestShows: []
    }
  },
  computed: {
    ...mapGetters('show', ['loading'])
  },
  async mounted() {
    await this.loadShows()
    await this.loadCategories()
  },
  methods: {
    ...mapActions('show', ['getShowList']),

    async loadCategories() {
      const { content } = await getCategory()
      this.categories = content
      console.log(this.categories)
    },

    async loadShows() {
      try {
        // 获取热门演出
        const hotRes = await getEvent(1, 4, "广州市")
        this.hotShows = hotRes.list

        // 获取推荐演出
        const recommandRes  = await getEvent(1, 4, null, 3)
        this.recommendedShows = recommandRes.list

        // 获取最新演出
        const latestRes = await getEvent(1, 4, null, null, "2025-07-01", "2025-07-10")
        this.latestShows = latestRes.list

        console.log(this.hotShows)
        console.log(this.recommendedShows)
        console.log(this.latestShows)

      } catch (error) {
        console.error('加载演出数据失败:', error)
        // 使用模拟数据
        this.hotShows = this.getMockShows('hot')
        this.recommendedShows = this.getMockShows('recommended')
        this.latestShows = this.getMockShows('latest')
      }
    },

    getMockShows(type) {
      const mockShows = [
        {
          id: 1,
          title: '周杰伦2024巡回演唱会-北京站',
          venue: '北京工人体育馆',
          time: '2024-06-15 19:30',
          minPrice: 380,
          image: 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=周杰伦演唱会',
          isHot: true,
          isNew: false
        },
        {
          id: 2,
          title: '经典话剧《雷雨》',
          venue: '国家大剧院',
          time: '2024-05-20 19:30',
          minPrice: 180,
          image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=雷雨话剧',
          isHot: false,
          isNew: true
        },
        {
          id: 3,
          title: '儿童剧《小王子》',
          venue: '中国儿童艺术剧院',
          time: '2024-05-25 14:30',
          minPrice: 120,
          image: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=小王子儿童剧',
          isHot: false,
          isNew: true
        },
        {
          id: 4,
          title: '音乐剧《猫》',
          venue: '保利剧院',
          time: '2024-06-10 19:30',
          minPrice: 280,
          image: 'https://via.placeholder.com/300x200/9C27B0/ffffff?text=音乐剧猫',
          isHot: true,
          isNew: false
        }
      ]

      return mockShows.slice(0, 4)
    },

    goToShow(showId) {
      this.$router.push(`/show/${showId}`)
    },

    goToCategory(category) {
      // 跳转到分类页面，传递分类ID
      this.$router.push({ name: 'Category', params: { id: category.id } })
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
