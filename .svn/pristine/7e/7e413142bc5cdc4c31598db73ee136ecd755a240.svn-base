<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <div class="content">
      <h1 class="code">404</h1>
      <h2 class="message">页面不存在</h2>
      <p class="description">抱歉，您访问的页面不存在或已被移除。</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.content {
  text-align: center;
  padding: 20px;
}

.code {
  font-size: 120px;
  margin: 0;
  color: #409EFF;
  line-height: 1.2;
}

.message {
  font-size: 24px;
  color: #303133;
  margin: 0 0 20px 0;
}

.description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}
</style> 