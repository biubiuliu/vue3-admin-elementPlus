<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 安全设置表单数据
const securityForm = reactive({
  twoFactorAuth: false,
  loginNotifications: true,
  lastLoginTime: '2023-05-15 14:30:22',
  lastLoginIP: '192.168.1.1',
  sessionTimeout: 30,
  passwordExpiration: 90
})

// 会话超时选项
const timeoutOptions = [
  { value: 15, label: '15分钟' },
  { value: 30, label: '30分钟' },
  { value: 60, label: '1小时' },
  { value: 120, label: '2小时' },
  { value: 240, label: '4小时' }
]

// 密码过期选项
const passwordExpirationOptions = [
  { value: 30, label: '30天' },
  { value: 60, label: '60天' },
  { value: 90, label: '90天' },
  { value: 180, label: '180天' },
  { value: 365, label: '1年' },
  { value: 0, label: '永不过期' }
]

// 表单引用
const formRef = ref(null)

// 保存安全设置
const saveSettings = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        // 这里应该添加实际保存设置的API调用
        console.log('保存安全设置:', securityForm)
        
        // 显示成功消息
        ElMessage({
          message: '安全设置已成功保存',
          type: 'success'
        })
      }
    })
  }
}

// 重置所有会话
const resetSessions = () => {
  // 实际应用中，应该调用API来重置用户会话
  ElMessage({
    message: '已成功重置所有会话，其他设备已登出',
    type: 'success'
  })
}

// 生成新的恢复码
const generateRecoveryCodes = () => {
  // 实际应用中，应该调用API来生成新的恢复码
  ElMessage({
    message: '已生成新的恢复码，请妥善保存',
    type: 'success'
  })
}
</script>

<template>
  <el-card class="security-settings">
    <template #header>
      <div class="card-header">
        <h3>安全设置</h3>
      </div>
    </template>
    
    <el-form 
      ref="formRef" 
      :model="securityForm" 
      label-width="150px" 
      class="security-form"
    >
      <!-- 登录信息部分 -->
      <h4 class="section-title">登录信息</h4>
      <el-form-item label="上次登录时间">
        <el-text>{{ securityForm.lastLoginTime }}</el-text>
      </el-form-item>
      
      <el-form-item label="上次登录IP">
        <el-text>{{ securityForm.lastLoginIP }}</el-text>
      </el-form-item>
      
      <el-divider />
      
      <!-- 安全选项部分 -->
      <h4 class="section-title">安全选项</h4>
      <el-form-item label="两步验证">
        <el-switch v-model="securityForm.twoFactorAuth" />
        <el-text class="description" type="info">启用后，登录时将需要额外的验证码</el-text>
      </el-form-item>
      
      <el-form-item v-if="securityForm.twoFactorAuth">
        <el-button @click="generateRecoveryCodes">生成恢复码</el-button>
        <el-text class="description" type="info">恢复码可用于在无法使用两步验证时登录</el-text>
      </el-form-item>
      
      <el-form-item label="异地登录通知">
        <el-switch v-model="securityForm.loginNotifications" />
        <el-text class="description" type="info">启用后，检测到异地登录时将发送邮件通知</el-text>
      </el-form-item>
      
      <el-form-item label="会话超时">
        <el-select v-model="securityForm.sessionTimeout">
          <el-option
            v-for="item in timeoutOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-text class="description" type="info">无操作超过此时间后将自动登出</el-text>
      </el-form-item>
      
      <el-form-item label="密码过期时间">
        <el-select v-model="securityForm.passwordExpiration">
          <el-option
            v-for="item in passwordExpirationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-text class="description" type="info">设置密码需要定期更新的频率</el-text>
      </el-form-item>
      
      <el-divider />
      
      <!-- 会话管理部分 -->
      <h4 class="section-title">会话管理</h4>
      <el-form-item>
        <el-button type="warning" @click="resetSessions">重置所有会话</el-button>
        <el-text class="description" type="info">重置后，所有其他设备将被登出</el-text>
      </el-form-item>
      
      <!-- 提交按钮 -->
      <el-divider />
      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.security-settings {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.security-form {
  max-width: 700px;
}

.section-title {
  margin: 20px 0 10px 0;
  color: var(--el-color-primary);
}

.description {
  margin-left: 10px;
  font-size: 0.9em;
}

.el-text {
  line-height: 32px;
}

.el-divider {
  margin: 20px 0;
}
</style> 