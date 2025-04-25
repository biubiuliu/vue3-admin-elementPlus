<script setup lang="ts">
import { defineProps, defineEmits, defineAsyncComponent } from 'vue'

// 导入自身，用于递归
const RecursiveMenuItem = defineAsyncComponent(() => import('./RecursiveMenuItem.vue'))

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// 处理子菜单点击
const emit = defineEmits(['select'])
const handleSelect = (path) => {
  emit('select', path)
}

// 递归查找菜单项的第一个可点击子菜单
const findFirstClickableSubmenu = (menuItem) => {
  // 如果有子菜单，递归查找第一个可点击的子菜单
  if (menuItem.children && menuItem.children.length > 0) {
    // 递归检查第一个子菜单
    return findFirstClickableSubmenu(menuItem.children[0])
  }
  
  // 没有子菜单，返回当前菜单路径
  return menuItem.path
}

// 处理子菜单点击事件，对于有子菜单的项，自动选择第一个子菜单
const handleSubMenuTitleClick = (item) => {
  if (item.children && item.children.length > 0) {
    const targetPath = findFirstClickableSubmenu(item)
    emit('select', targetPath)
  }
}

// 定义其他处理函数
const handleOpen = (key, keyPath) => {
  // 处理菜单打开逻辑
}

const handleClick = (menu) => {
  // 处理菜单点击逻辑
}
</script>

<script lang="ts">
export default {
  name: 'RecursiveMenuItem'
}
</script>

<template>
  <!-- 有子菜单的情况 -->
  <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
    <template #title>
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <span>{{ item.title }}</span>
    </template>
    
    <!-- 递归渲染子菜单项 -->
    <template v-for="child in item.children" :key="child.path">
      <recursive-menu-item 
        :item="child" 
        @select="(path) => $emit('select', path)"
      />
    </template>
  </el-sub-menu>
  
  <!-- 没有子菜单的情况 -->
  <el-menu-item v-else :index="item.path">
    <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
    <template #title>{{ item.title }}</template>
  </el-menu-item>
</template>

<style scoped>
/* 处理菜单样式以适应多级嵌套 */
:deep(.el-sub-menu .el-sub-menu) {
  padding-left: 0;
}

:deep(.el-sub-menu .el-sub-menu .el-sub-menu__title) {
  padding-left: 54px !important;
}

:deep(.el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 78px !important;
}

/* 第四级菜单 */
:deep(.el-sub-menu .el-sub-menu .el-sub-menu .el-sub-menu__title) {
  padding-left: 78px !important;
}

:deep(.el-sub-menu .el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 102px !important;
}
</style> 