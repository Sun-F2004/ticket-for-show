<template>
  <div class="category-page">
    <Header/>
    <div class="category-container container">
      <!-- 多行筛选栏 -->
      <div class="filter-bar">
        <!-- 城市 -->
        <div class="filter-row">
          <span class="filter-label">城市：</span>
          <el-tag
            v-for="city in cities"
            :key="city"
            :type="city === selectedCity ? 'primary' : 'info'"
            @click="onCityChange(city)"
            class="filter-tag"
            effect="plain"
          >
            {{ city }}
          </el-tag>
        </div>
        <!-- 分类 -->
        <div class="filter-row">
          <span class="filter-label">分类：</span>
          <el-tag
            v-for="cat in categories"
            :key="cat.id"
            :type="cat.id == selectedCategory ? 'primary' : 'info'"
            @click="onCategoryChange(cat.id)"
            class="filter-tag"
            effect="plain"
          >
            {{ cat.categoryName }}
          </el-tag>
        </div>
        <!-- 子类（模拟） -->
        <!-- <div class="filter-row">
          <span class="filter-label">子类：</span>
          <el-tag
            v-for="sub in subCategories"
            :key="sub"
            :type="sub === selectedSubCategory ? 'primary' : 'info'"
            @click="onSubCategoryChange(sub)"
            class="filter-tag"
            effect="plain"
          >
            {{ sub }}
          </el-tag>
        </div> -->
        <!-- 时间 -->
        <div class="filter-row">
          <span class="filter-label">时间：</span>
          <el-tag
            v-for="t in timeOptions"
            :key="t.value"
            :type="t.value === selectedTime ? 'primary' : 'info'"
            @click="onTimeChange(t.value)"
            class="filter-tag"
            effect="plain"
          >
            {{ t.label }}
          </el-tag>
        </div>
      </div>
      <!-- 二级导航 -->
      <div class="sub-nav">
        <el-tabs v-model="selectedSort" @tab-click="onSortChange" type="card">
          <el-tab-pane v-for="sort in sortOptions" :key="sort.value" :label="sort.label" :name="sort.value"/>
        </el-tabs>
      </div>
      <!-- 列表区域 -->
      <div class="show-list">
        <div v-if="loading" class="loading-box">
          <el-spinner/>
        </div>
        <div v-else-if="events.length === 0" class="empty-box">
          暂无演出信息
        </div>
        <div v-else class="show-grid">
          <div
            v-for="show in events"
            :key="show.id"
            class="show-card"
            @click="goToShow(show.id)"
          >
            <div class="show-image">
              <img :src="show.mainImageUrl || show.image" :alt="show.name || show.title"/>
              <div class="show-tags">
                <span v-if="show.isHot" class="tag tag-hot">热门</span>
                <span v-if="show.isNew" class="tag tag-new">新品</span>
              </div>
            </div>
            <div class="show-info">
              <h3 class="show-title">{{ show.name || show.title }}</h3>
              <p class="show-venue">{{ show.position || show.venue }}</p>
              <p class="show-time">{{ show.startTime || show.time }}</p>
              <div class="show-price">
                <span class="price">¥{{ show.minPrice }}</span>
                <span class="price-desc">起</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
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
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import { getCategory, getEvent } from '@/api/event'

export default {
  name: 'Category',
  components: { Header },
  data() {
    return {
      // 城市、分类、子类、时间、排序等筛选项
      cities: ['全部', '北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '西安', '南京'],
      selectedCity: '全部',
      categories: [],
      selectedCategory: '',
      // subCategories: ['全部', '其他', '球类运动', '电竞'], // 可根据实际接口调整
      selectedSubCategory: '全部',
      timeOptions: [
        { label: '全部', value: '' },
        { label: '今天', value: 'today' },
        { label: '明天', value: 'tomorrow' },
        { label: '本周末', value: 'weekend' },
        { label: '一个月内', value: 'month' },
        { label: '按日历', value: 'calendar' }
      ],
      selectedTime: '',
      sortOptions: [
        { label: '相关排序', value: 'relevant' },
        { label: '推荐排序', value: 'recommend' },
        { label: '最近开场', value: 'recent' },
        { label: '最新上架', value: 'newest' }
      ],
      selectedSort: 'recommend',
      // 列表数据
      events: [],
      loading: false,
      total: 0,
      pageSize: 12,
      currentPage: 1
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newVal) {
        console.log("rwarwarID:" + this.$route.params.id)
        this.selectedCategory = newVal
        this.currentPage = 1
        this.fetchCategories()
        this.fetchEvents()
      }
    }
  },
  methods: {
    async fetchCategories() {
      const { content } = await getCategory()
      this.categories = content
    },
    async fetchEvents() {
      this.loading = true
      try {
        // 时间筛选可根据实际接口调整
        let fromDate = null, toDate = null
        if (this.selectedTime === 'today') {
          fromDate = toDate = this.formatDate(new Date())
        } else if (this.selectedTime === 'tomorrow') {
          const d = new Date(); d.setDate(d.getDate() + 1)
          fromDate = toDate = this.formatDate(d)
        } else if (this.selectedTime === 'weekend') {
          // 本周末
          const now = new Date()
          const day = now.getDay()
          const saturday = new Date(now)
          saturday.setDate(now.getDate() + (6 - day))
          fromDate = this.formatDate(saturday)
          toDate = this.formatDate(saturday)
        } else if (this.selectedTime === 'month') {
          fromDate = this.formatDate(new Date())
          const d = new Date(); d.setMonth(d.getMonth() + 1)
          toDate = this.formatDate(d)
        }
        const res = await getEvent(
          this.currentPage,
          this.pageSize,

          this.selectedCity === '全部' ? null : this.selectedCity,
          this.selectedCategory === '全部' ? null : this.selectedCategory,
          fromDate,
          toDate
        )
        this.events = res.list || []
        this.total = res.total || 0
      } catch (e) {
        this.events = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    onCityChange(city) {
      this.selectedCity = city
      this.currentPage = 1
      this.fetchEvents()
    },
    onCategoryChange(id) {
      this.selectedCategory = id
      this.currentPage = 1
      this.fetchEvents()
    },
    onSubCategoryChange(sub) {
      this.selectedSubCategory = sub
      this.currentPage = 1
      this.fetchEvents()
    },
    onTimeChange(val) {
      this.selectedTime = val
      this.currentPage = 1
      this.fetchEvents()
    },
    onSortChange(tab) {
      this.selectedSort = tab.name
      this.currentPage = 1
      this.fetchEvents()
    },
    onPageChange(page) {
      this.currentPage = page
      this.fetchEvents()
    },
    goToShow(id) {
      this.$router.push(`/show/${id}`)
    },
    formatDate(date) {
      const y = date.getFullYear()
      const m = (date.getMonth() + 1).toString().padStart(2, '0')
      const d = date.getDate().toString().padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  }
}
</script>

<style lang="scss" scoped>
.category-page {
  min-height: 100vh;
  background: $background-color-base;
  .category-container {
    padding: 40px 0 60px 0;
  }
}
.filter-bar {
  margin-bottom: 20px;
  .filter-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .filter-label {
      font-weight: bold;
      margin-right: 10px;
      color: $text-regular;
      min-width: 48px;
    }
    .filter-tag {
      margin-right: 8px;
      cursor: pointer;
    }
  }
}
.sub-nav {
  margin-bottom: 20px;
  .el-tabs__item.is-active {
    color: $primary-color !important;
    font-weight: bold;
  }
}
.show-list {
  min-height: 300px;
}
.show-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.show-card {
  background: #fff;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-light;
  overflow: hidden;
  transition: $transition-base;
  cursor: pointer;
  display: flex;
  .show-image {
    position: relative;
    width: 160px;
    height: 200px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .show-tags {
      position: absolute;
      top: 10px;
      left: 10px;
      .tag {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 12px;
        color: #fff;
        margin-right: 6px;
        &.tag-hot {
          background: $primary-color;
        }
        &.tag-new {
          background: $secondary-color;
        }
      }
    }
  }
  .show-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .show-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: $text-primary;
    }
    .show-venue, .show-time {
      font-size: 14px;
      color: $text-secondary;
      margin-bottom: 4px;
    }
    .show-price {
      margin-top: 8px;
      .price {
        color: $primary-color;
        font-size: 18px;
        font-weight: bold;
      }
      .price-desc {
        color: $text-secondary;
        font-size: 12px;
        margin-left: 2px;
      }
    }
  }
}
.loading-box, .empty-box {
  text-align: center;
  color: $text-secondary;
  padding: 60px 0;
  font-size: 18px;
}
.pagination-bar {
  margin-top: 40px;
  text-align: center;
}
</style> 