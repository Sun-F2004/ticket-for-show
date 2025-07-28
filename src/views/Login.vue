<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h2>用户登录</h2>
          <p>欢迎回来，请登录您的账户</p>
        </div>

        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            @submit.native.prevent="handleLogin"
        >
          <el-form-item prop="account">
            <el-input
                v-model="loginForm.account"
                placeholder="请输入账户名"
                prefix-icon="el-icon-user"
                size="large"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                size="large"
                show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button
                type="primary"
                size="medium"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-divider">
          <span>或</span>
        </div>

        <div class="register-link">
          <span>还没有账户？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'Login',

  data() {
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      loading: false
    }
  },

  methods: {
    ...mapActions('user', ['login']),

    async handleLogin() {
      try {
        let valid = false
        this.$refs.loginForm.validate(isValid => {
          valid = isValid
        })
        if (!valid) return

        this.loading = true
        await this.login(this.loginForm)

        this.$message.success('登录成功')
        // 前往首页
        this.$router.push({name: 'Home'})
      } catch (error) {
        this.$message.error(error.message || '登录失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-box {
  background: #fff;
  border-radius: $border-radius-extra-large;
  box-shadow: $box-shadow-dark;
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    font-size: 28px;
    color: $text-primary;
    margin-bottom: 10px;
    font-weight: bold;
  }

  p {
    color: $text-secondary;
    font-size: $font-size-base;
  }
}

.login-form {
  .login-btn {
    width: 100%;
    height: 50px;
    font-size: $font-size-medium;
    font-weight: 600;
  }
}

.login-divider {
  text-align: center;
  margin: 30px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: $border-color-light;
  }

  span {
    background: #fff;
    padding: 0 15px;
    color: $text-secondary;
    font-size: $font-size-small;
  }
}

.register-link {
  text-align: center;
  font-size: $font-size-base;

  span {
    color: $text-secondary;
  }

  a {
    color: $primary-color;
    text-decoration: none;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
