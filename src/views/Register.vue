<template>
  <div class="register-page">
    <Header />
    
    <div class="register-container">
      <div class="register-box">
        <div class="register-header">
          <h2>用户注册</h2>
          <p>创建您的账户，开始购票之旅</p>
        </div>
        
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.native.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              prefix-icon="el-icon-mobile-phone"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              prefix-icon="el-icon-message"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              size="large"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              prefix-icon="el-icon-lock"
              size="large"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="verificationCode">
            <div class="verification-code">
              <el-input
                v-model="registerForm.verificationCode"
                placeholder="请输入验证码"
                prefix-icon="el-icon-key"
                size="large"
              />
              <el-button
                type="primary"
                :disabled="countdown > 0"
                @click="sendVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="agreeTerms">
              我已阅读并同意
              <a href="#" @click.prevent="showTerms">《用户协议》</a>
              和
              <a href="#" @click.prevent="showPrivacy">《隐私政策》</a>
            </el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-btn"
              :loading="loading"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="login-link">
          <span>已有账户？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { sendVerificationCode } from '@/api/user'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Register',
  components: {
    Header,
    Footer
  },
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    
    return {
      registerForm: {
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度为6位', trigger: 'blur' }
        ]
      },
      agreeTerms: false,
      loading: false,
      countdown: 0
    }
  },
  methods: {
    ...mapActions('user', ['register']),
    
    async handleRegister() {
      try {
        const valid = await this.$refs.registerForm.validate()
        if (!valid) return
        
        if (!this.agreeTerms) {
          this.$message.warning('请先同意用户协议和隐私政策')
          return
        }
        
        this.loading = true
        await this.register(this.registerForm)
        
        this.$message.success('注册成功，请登录')
        this.$router.push('/login')
      } catch (error) {
        this.$message.error(error.message || '注册失败')
      } finally {
        this.loading = false
      }
    },
    
    async sendVerificationCode() {
      if (!this.registerForm.phone) {
        this.$message.warning('请先输入手机号')
        return
      }
      
      try {
        await sendVerificationCode(this.registerForm.phone)
        this.$message.success('验证码已发送')
        this.startCountdown()
      } catch (error) {
        this.$message.error(error.message || '发送验证码失败')
      }
    },
    
    startCountdown() {
      this.countdown = 60
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    
    showTerms() {
      this.$message.info('用户协议功能开发中')
    },
    
    showPrivacy() {
      this.$message.info('隐私政策功能开发中')
    }
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

.register-box {
  background: #fff;
  border-radius: $border-radius-extra-large;
  box-shadow: $box-shadow-dark;
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.register-header {
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

.register-form {
  .verification-code {
    display: flex;
    gap: 10px;
    
    .el-input {
      flex: 1;
    }
    
    .el-button {
      width: 120px;
      white-space: nowrap;
    }
  }
  
  .register-btn {
    width: 100%;
    height: 50px;
    font-size: $font-size-medium;
    font-weight: 600;
  }
  
  .el-checkbox {
    a {
      color: $primary-color;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.login-link {
  text-align: center;
  font-size: $font-size-base;
  margin-top: 20px;
  
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
  .register-box {
    padding: 30px 20px;
  }
  
  .verification-code {
    flex-direction: column;
    
    .el-button {
      width: 100% !important;
    }
  }
}
</style> 