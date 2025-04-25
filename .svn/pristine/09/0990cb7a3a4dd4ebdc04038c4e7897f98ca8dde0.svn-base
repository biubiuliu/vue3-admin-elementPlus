<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMenuRoutes, getParentRoute } from '../../router/config'
import RecursiveMenuItem from '../menu/RecursiveMenuItem.vue'
import { useThemeStore } from '../../stores/theme'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()

// 接收父组件传递的折叠状态和布局类型
const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  },
  layoutType: {
    type: String,
    default: 'sidebar'
  }
})

// 从统一路由配置获取所有菜单项
const allMenuItems = getMenuRoutes()

// 获取当前路由所属的顶级菜单
const getCurrentParentMenu = () => {
  // 当前路径
  const currentPath = route.path
  
  // 先检查是否直接匹配到某个顶级菜单
  const directMatch = allMenuItems.find(item => item.path === currentPath)
  if (directMatch) return directMatch
  
  // 递归检查是否是某个菜单的子路径
  const findParentByPath = (items, path) => {
    for (const item of items) {
      // 检查路径前缀
      if (path.startsWith(item.path + '/') && item.path !== '/') {
        return item
      }
      
      // 检查子菜单
      if (item.children && item.children.length > 0) {
        // 直接子菜单匹配
        const directChild = item.children.find(child => child.path === path)
        if (directChild) return item
        
        // 递归检查更深层次
        const subParent = findParentByPath(item.children, path)
        if (subParent) return subParent
      }
    }
    
    return null
  }
  
  // 执行递归查找
  const parent = findParentByPath(allMenuItems, currentPath)
  if (parent) return parent
  
  // 通过路由配置获取父路由
  return getParentRoute(currentPath)
}

// 根据布局类型和当前路由计算要显示的菜单项
const menuItems = computed(() => {
  // 顶部布局模式
  if (props.layoutType === 'top') {
    const parentMenu = getCurrentParentMenu()
    
    // 如果找到父菜单并且有子菜单，则显示子菜单
    if (parentMenu && parentMenu.children && parentMenu.children.length > 0) {
      return parentMenu.children
    }
    
    // 如果没有找到子菜单，返回空数组
    return []
  }
  
  // 侧边栏布局，返回所有菜单
  return allMenuItems
})

// 计算当前活动菜单
const activeMenu = computed(() => {
  return route.path
})

// 监听路由变化，确保在子路由切换时更新菜单项
watch(() => route.path, () => {
  // 仅用于触发重新计算菜单项
}, { immediate: true })

const handleSelect = (path) => {
  router.push(path)
}

// 使用主题配置中的颜色
const menuBgColor = computed(() => {
  return themeStore.themeMode === 'dark' ? '#141414' : '#ffffff'
})

const menuTextColor = computed(() => {
  return themeStore.themeMode === 'dark' ? 'rgba(255, 255, 255, 0.65)' : '#303133'
})

const activeTextColor = computed(() => {
  // 暗色和亮色主题都使用主题色
  return themeStore.primaryColor
})

// 计算菜单激活背景色
const activeBgColor = computed(() => {
  return themeStore.themeMode === 'dark' ? 'rgba(64, 158, 255, 0.15)' : '#f5f5f5'
})

// 计算菜单悬停背景色
const hoverBgColor = computed(() => {
  return themeStore.themeMode === 'dark' ? '#1f1f1f' : '#f5f5f5'
})
</script>

<template>
  <div 
    class="sidebar" 
    :class="{ 
      'is-collapsed': isCollapse,
      'top-layout-sidebar': layoutType === 'top',
      'dark-theme': themeStore.themeMode === 'dark'
    }"
    :style="{ 
      backgroundColor: menuBgColor
    }"
  >
    <!-- 仅在侧边栏布局时显示logo -->
    <div 
      v-if="layoutType === 'sidebar'" 
      class="logo-container" 
      :style="{ 
        backgroundColor: themeStore.themeMode === 'dark' ? '#141414' : '#ffffff'
      }"
    >
      <img src="/logo.png" class="logo" alt="系统logo" />
      <h2 
        v-if="!isCollapse" 
        class="title" 
        :style="{ color: themeStore.themeMode === 'dark' ? '#ffffff' : '#303133' }"
      >
        管理系统
      </h2>
    </div>

    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      :collapse="isCollapse && layoutType === 'sidebar'"
      :background-color="menuBgColor"
      :text-color="menuTextColor"
      :active-text-color="activeTextColor"
      @select="handleSelect"
    >
      <template v-for="item in menuItems" :key="item.path">
        <recursive-menu-item 
          :item="item" 
          @select="handleSelect"
        />
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  background-color: v-bind(menuBgColor);
  width: 220px;
  transition: width 0.3s ease-in-out, background-color 0.3s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  z-index: 10;
}

.is-collapsed {
  width: 64px;
}

.top-layout-sidebar {
  box-shadow: none;
  width: 220px;
}

.logo-container {
  height: 60px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo {
  height: 32px;
  margin-right: 10px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  margin: 0;
  transition: color 0.3s;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

.dark-theme {
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.5);
}

/* 自定义菜单样式 */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: v-bind(hoverBgColor) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: v-bind(activeBgColor) !important;
}
</style> 