<template>
  <div class="login-page">
    <Header />
    
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
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名/手机号/邮箱"
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
            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <router-link to="/forgot-password" class="forgot-link">忘记密码？</router-link>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
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
        
        <div class="social-login">
          <el-button class="social-btn wechat">
            <i class="el-icon-chat-dot-round"></i>
            微信登录
          </el-button>
          <el-button class="social-btn qq">
            <i class="el-icon-message"></i>
            QQ登录
          </el-button>
        </div>
        
        <div class="register-link">
          <span>还没有账户？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Login',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      },
      rememberMe: false,
      loading: false
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    
    async handleLogin() {
      try {
        const valid = await this.$refs.loginForm.validate()
        if (!valid) return
        
        this.loading = true
        await this.login(this.loginForm)
        
        this.$message.success('登录成功')
        
        // 跳转到之前的页面或首页
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
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
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
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
  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .forgot-link {
      color: $primary-color;
      text-decoration: none;
      font-size: $font-size-small;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
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

.social-login {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  
  .social-btn {
    flex: 1;
    height: 45px;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
    
    &.wechat {
      background: #07c160;
      border-color: #07c160;
      color: #fff;
      
      &:hover {
        background: darken(#07c160, 10%);
        border-color: darken(#07c160, 10%);
      }
    }
    
    &.qq {
      background: #12b7f5;
      border-color: #12b7f5;
      color: #fff;
      
      &:hover {
        background: darken(#12b7f5, 10%);
        border-color: darken(#12b7f5, 10%);
      }
    }
    
    i {
      margin-right: 5px;
    }
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

// 响应式设计
@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }
  
  .social-login {
    flex-direction: column;
    
    .social-btn {
      width: 100%;
    }
  }
}
</style> 