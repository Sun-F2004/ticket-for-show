<template>
  <div class="header">
    <div class="header-top">
      <div class="container">
        <div class="header-top-left">
          <span>客服热线：400-123-4567</span>
        </div>
        <div class="header-top-right">
          <template v-if="isLogin">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <i class="el-icon-user"></i>
                {{ userInfo.account }}
                <i class="el-icon-arrow-down"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userCenter">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/login" class="login-link">登录</router-link>
            <router-link to="/register" class="register-link">注册</router-link>
          </template>
        </div>
      </div>
    </div>

    <div class="header-main">
      <div class="container">
        <div class="logo">
          <router-link to="/">
            <h1>演出购票系统</h1>
          </router-link>
        </div>
      </div>
    </div>

    <div class="header-nav">
      <div class="container">
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            background-color="#fff"
            text-color="#333"
            active-text-color="#ff6b35"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/category">查询</el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      activeIndex: '/'
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin', 'userInfo'])
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path
    }
  },
  async mounted() {
    this.activeIndex = this.$route.path
  },
  methods: {
    ...mapActions('user', ['logout']),

    handleSelect(key) {
      if (this.activeIndex === key) return
      this.$router.push(key)
    },

    async handleCommand(command) {
      switch (command) {
        case 'userCenter':
          if (this.$route.path !== '/user') this.$router.push('/user')
          break
        case 'logout':
          try {
            await this.logout()
            this.$message.success('退出登录成功')
            this.$router.push('/')
          } catch (error) {
            this.$message.error('退出登录失败')
          }
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-top {
  background: #f5f5f5;
  padding: 8px 0;
  font-size: $font-size-small;
  color: $text-secondary;

  .header-top-left {
    float: left;
  }

  .header-top-right {
    float: right;

    .login-link, .register-link {
      color: $text-secondary;
      text-decoration: none;
      margin-left: 15px;

      &:hover {
        color: $primary-color;
      }
    }

    .user-info {
      cursor: pointer;
      color: $text-regular;

      &:hover {
        color: $primary-color;
      }
    }
  }
}

.header-main {
  padding: 20px 0;

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    flex: 0 0 200px;

    h1 {
      font-size: 24px;
      color: $primary-color;
      font-weight: bold;
      margin: 0;
    }

    a {
      text-decoration: none;
    }
  }

  .search-box {
    flex: 1;
    max-width: 500px;
    margin: 0 40px;

    .search-input {
      .el-input__inner {
        border-radius: 20px 0 0 20px;
        border-right: none;
      }

      .el-input-group__append {
        border-radius: 0 20px 20px 0;
        background: $primary-color;
        border-color: $primary-color;
        color: #fff;

        &:hover {
          background: darken($primary-color, 10%);
        }
      }
    }
  }

  .header-actions {
    flex: 0 0 100px;
    text-align: right;

    .cart-link {
      position: relative;
      display: inline-block;
      padding: 10px;
      color: $text-regular;
      text-decoration: none;
      font-size: 20px;

      &:hover {
        color: $primary-color;
      }

      .cart-count {
        position: absolute;
        top: 5px;
        right: 5px;
        background: $danger-color;
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 18px;
        text-align: center;
      }
    }
  }
}

.header-nav {
  border-top: 1px solid $border-color-light;

  .el-menu {
    border: none;

    .el-menu-item {
      font-size: $font-size-medium;
      font-weight: 500;

      &:hover, &.is-active {
        color: $primary-color;
        border-bottom-color: $primary-color;
      }
    }
  }
}

// 清除浮动
.header-top::after {
  content: '';
  display: table;
  clear: both;
}
</style>
