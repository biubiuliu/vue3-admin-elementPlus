<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const userForm = reactive({
  username: 'admin',
  email: 'admin@example.com',
  password: '',
  confirmPassword: '',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  language: 'zh-CN',
  theme: 'light',
  notifications: true
})

const passwordRules = reactive({
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== userForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const languages = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: '英文' }
]

const formRef = ref(null)

const saveSettings = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        console.log('保存用户设置:', userForm)
        
        ElMessage({
          message: '设置已成功保存',
          type: 'success'
        })
      }
    })
  }
}

const handleAvatarSuccess = (response, file) => {
  userForm.avatar = URL.createObjectURL(file.raw)
  
  ElMessage({
    message: '头像上传成功',
    type: 'success'
  })
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}
</script>

<template>
  <div class="user-settings">
    <h2 class="page-title">用户设置</h2>
    
    <el-card class="settings-card">
      <el-form 
        ref="formRef" 
        :model="userForm" 
        :rules="passwordRules" 
        label-width="120px"
      >
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            action="/api/user/avatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" disabled />
        </el-form-item>
        
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" type="email" />
        </el-form-item>
        
        <el-form-item label="新密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="留空表示不修改密码" />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
        
        <el-form-item label="系统语言">
          <el-select v-model="userForm.language" placeholder="请选择语言">
            <el-option
              v-for="item in languages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="界面主题">
          <el-radio-group v-model="userForm.theme">
            <el-radio value="light">浅色</el-radio>
            <el-radio value="dark">深色</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="接收通知">
          <el-switch v-model="userForm.notifications" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.user-settings {
  padding: 10px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}

.settings-card {
  margin-bottom: 20px;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 