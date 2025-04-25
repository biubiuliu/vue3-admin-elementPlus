<script setup>
import { ref, computed } from 'vue'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#409EFF'
  }
})

// 动态获取图标组件
const iconComponent = computed(() => {
  return props.icon ? Icons[props.icon] : null
})
</script>

<template>
  <el-card class="stat-card">
    <div class="card-content">
      <div class="icon-wrapper" :style="{ backgroundColor: color + '10' }">
        <el-icon :style="{ color: color }">
          <component :is="iconComponent" />
        </el-icon>
      </div>
      <div class="stat-info">
        <div class="stat-value">{{ value }}</div>
        <div class="stat-title">{{ title }}</div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.stat-card {
  height: 100px;
  margin-bottom: 0;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  font-size: 24px;
  margin-right: 15px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 5px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}
</style> 