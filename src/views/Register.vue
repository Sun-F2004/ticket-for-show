<template>
  <div class="register-page">
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
          <el-form-item prop="account">
            <el-input
                v-model="registerForm.account"
                placeholder="请输入账户名"
                prefix-icon="el-icon-user"
                size="large"
            />
          </el-form-item>

          <el-form-item prop="realName">
            <el-input
                v-model="registerForm.realName"
                placeholder="请输入真名"
                prefix-icon="el-icon-user"
                size="large"
            />
          </el-form-item>

          <el-form-item prop="nickname">
            <el-input
                v-model="registerForm.nickname"
                placeholder="请输入昵称"
                prefix-icon="el-icon-edit-outline"
                size="large"
            />
          </el-form-item>

          <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="registerForm.gender">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="phoneNumber">
            <el-input
                v-model="registerForm.phoneNumber"
                placeholder="请输入电话号码"
                prefix-icon="el-icon-phone-outline"
                size="large"
            />
          </el-form-item>

          <el-form-item prop="birthday">
            <el-date-picker
                v-model="registerForm.birthday"
                type="date"
                placeholder="请选择生日"
                style="width: 100%;">
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="idCardNumber">
            <el-input
                v-model="registerForm.idCardNumber"
                placeholder="请输入身份证号码"
                prefix-icon="el-icon-bank-card"
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

<!--          <el-form-item prop="captcha">-->
<!--            <div class="captcha">-->
<!--              <el-input-->
<!--                  v-model="registerForm.captcha"-->
<!--                  placeholder="请输入验证码"-->
<!--                  prefix-icon="el-icon-key"-->
<!--                  size="large"-->
<!--              />-->

<!--              <el-image-->
<!--                :src="captchaUrl"-->
<!--                fit="cover"/>-->
<!--            </div>-->
<!--          </el-form-item>-->

          <el-form-item>
            <el-button
                type="primary"
                size="medium"
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
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import {getCaptcha} from "@/api/common";

export default {
  name: 'Register',

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
        account: '',
        realName: '',
        nickname: '',
        gender: '',
        phoneNumber: '',
        birthday: '',
        idCardNumber: '',
        password: '',
        confirmPassword: '',
        captcha: ''
      },
      registerRules: {
        account: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        realName: [
          {required: true, message: '请输入真名', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phoneNumber: [
          {required: true, message: '请输入电话号码', trigger: 'blur'}
        ],
        birthday: [
          {required: true, message: '请选择生日', trigger: 'change'}
        ],
        idCardNumber: [
          {required: true, message: '请输入身份证号码', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {validator: validateConfirmPassword, trigger: 'blur'}
        ],
        // captcha: [
        //   {required: true, message: '请输入验证码', trigger: 'blur'}
        // ]
      },
      loading: false,
      // captchaUrl: '',
      // captchaKey: '' // 验证码对应的key标识
    }
  },

  // async mounted() {
  //   const {captchaUrl, captchaKey} = await getCaptcha()
  //   this.captchaUrl = captchaUrl
  //   this.captchaKey = captchaKey
  // },

  methods: {
    ...mapActions('user', ['register']),

    async handleRegister() {
      try {
        let valid = false
        this.$refs.registerForm.validate(isValid => {
          valid = isValid
        })
        if (!valid) return

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
  height: 100vh;
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
  .captcha {
    display: flex;
    gap: 10px;

    .el-input {
      flex: 1;
    }

    .el-image {
      width: 120px;
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
</style>
