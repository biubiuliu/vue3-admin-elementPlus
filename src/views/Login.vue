<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { getModuleStyleList, login } from '@/servers/home'
import { aesEncrypt } from '@/utils/aes'
import { setToken } from '@/utils/auth'

const router = useRouter()
const loginFormRef = ref(null)

const loginForm = reactive({
  userName: 'admin',
  userpwd: 'secom@123',
  remember: false,
  perType: 1
})

const loginRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  userpwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6个字符', trigger: 'blur' }
  ]
}

const loading = ref(false)

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    let params = {
      userName: aesEncrypt(loginForm.userName),
      userpwd: aesEncrypt(loginForm.userpwd),
      perType: loginForm.perType
    }
    
    loading.value = true
    try {
      const res = await login(params)
      console.log('%c🌈 登录成功! 🌈', 'color: green; font-size: 18px;', res)
      
      setToken(res.token, res.expires || 7200)
      
      router.push({ path: '/dashboard' })
    } catch (err) {
      console.log('%c🌈 登录失败! 🌈', 'color: red; font-size: 18px;', err)
    } finally {
      loading.value = false
    }
  })
}

const getModuleStyleListApi = () => {
  getModuleStyleList().then(res => {
    console.log(res)
  })
}

onMounted(() => {
  getModuleStyleListApi()
})
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img src="/logo.png" alt="Logo" class="logo" />
        <h1 class="title">后台管理系统</h1>
      </div>
      
      <el-card class="login-form-card">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
        >
          <h2 class="form-title">用户登录</h2>
          
          <el-form-item label="用户名" prop="userName">
            <el-input 
              v-model="loginForm.userName"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item label="密码" prop="userpwd">
            <el-input
              v-model="loginForm.userpwd"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <div class="remember-forgot">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码?</el-link>
          </div>
          
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form>
      </el-card>
      
      <div class="login-footer">
        <p>Copyright © {{ new Date().getFullYear() }} 管理系统. 版权所有.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+');
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  height: 60px;
  margin-bottom: 15px;
}

.title {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.login-form-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 20px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 25px;
  color: #303133;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
}

.login-footer {
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style> 