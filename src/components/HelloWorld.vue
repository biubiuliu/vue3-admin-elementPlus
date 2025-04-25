<script setup>
import { ref } from 'vue'
import { useCounterStore } from '../stores/counter'

defineProps({
  msg: String,
})

const counter = useCounterStore()
</script>

<template>
  <el-card class="shadow-md">
    <h2 class="text-2xl font-bold text-center mb-4 text-indigo-600">{{ msg }}</h2>

    <div class="flex flex-col items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <el-button type="success" @click="counter.increment">
          <el-icon><i-ep-plus /></el-icon>
        </el-button>
        <span class="text-xl font-medium">{{ counter.count }}</span>
        <el-button type="danger" @click="counter.decrement">
          <el-icon><i-ep-minus /></el-icon>
        </el-button>
      </div>
      <p class="text-gray-600">双倍计数: {{ counter.doubleCount }}</p>
      <p class="text-sm text-gray-500">编辑 <code class="bg-gray-100 px-1 rounded">stores/counter.js</code> 来测试 Pinia</p>
    </div>

    <el-divider />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <el-alert
        title="Element Plus 集成成功"
        type="success"
        show-icon
      />
      <el-alert
        title="Tailwind CSS 集成成功"
        type="info"
        show-icon
      />
    </div>
  </el-card>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
