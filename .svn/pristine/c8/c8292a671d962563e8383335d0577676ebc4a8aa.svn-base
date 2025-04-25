<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { getMenuRoutes, hasChildRoutes } from '../../router/config'
import { useThemeStore } from '../../stores/theme'

// 使用主题 store
const themeStore = useThemeStore()

// 创建侧边栏折叠状态，供子组件共享
const isCollapse = computed(() => themeStore.isCollapsed)

const toggleCollapse = () => {
  themeStore.toggleCollapse()
}

// 获取布局类型（从主题store中获取）
const layoutType = computed(() => themeStore.layoutType)

// 顶部菜单的菜单项配置
const topMenuItems = [
  {
    title: '仪表盘',
    path: '/dashboard'
  },
  {
    title: '用户管理',
    path: '/users'
  },
  {
    title: '系统设置',
    path: '/settings',
    children: [
      {
        title: '项目设置',
        path: '/settings/project'
      },
      {
        title: '用户设置',
        path: '/settings/user'
      },
      {
        title: '安全设置',
        path: '/settings/security'
      }
    ]
  }
]

// 计算当前路由是否需要显示侧边栏
const route = useRoute()
const isSubRoute = computed(() => {
  const currentPath = route.path
  
  // 检查当前路径是否有子路由或者是子路由
  // 如果当前路径有子路由或者是某个路径的子路由，则显示侧边栏
  return hasChildRoutes(currentPath) || currentPath.split('/').filter(Boolean).length > 1
})

// 监听路由变化，以便正确更新isSubRoute
watch(() => route.path, () => {
  // 仅用于触发重新计算isSubRoute
}, { immediate: true })

// 为内容区域计算背景色，基于主题模式
const contentBgColor = computed(() => {
  return themeStore.themeMode === 'dark' ? 'var(--el-bg-color-page)' : '#f5f7f9'
})
</script>

<template>
  <div 
    class="app-container" 
    :class="{ 
      'top-layout': layoutType === 'top',
      'dark-theme': themeStore.themeMode === 'dark'
    }"
  >
    <!-- 侧边栏布局 -->
    <template v-if="layoutType === 'sidebar'">
      <app-sidebar :is-collapse="isCollapse" />
      <div class="main-container">
        <app-header :is-collapse="isCollapse" @toggle-collapse="toggleCollapse" />
        <div class="content-container" :style="{ backgroundColor: contentBgColor }">
          <router-view />
        </div>
      </div>
    </template>
    
    <!-- 顶部布局 -->
    <template v-else>
      <div class="top-layout-container">
        <div 
          class="top-header" 
          :class="{ 'dark-header': themeStore.themeMode === 'dark' }"
          :style="{ backgroundColor: themeStore.themeMode === 'dark' ? '#141414' : '#ffffff' }"
        >
          <div class="logo-area">
            <img src="/logo.png" class="logo" alt="系统logo" />
            <h2 
              class="title" 
              :style="{ color: themeStore.themeMode === 'dark' ? '#ffffff' : '#303133' }"
            >
              管理系统
            </h2>
          </div>
          <app-header 
            :is-collapse="isCollapse" 
            @toggle-collapse="toggleCollapse" 
            :layout-type="layoutType"
          />
        </div>
        
        <div class="body-container">
          <!-- 子路由菜单侧边栏 - 仅在子路由时显示 -->
          <app-sidebar 
            v-if="isSubRoute"
            :is-collapse="isCollapse" 
            :layout-type="layoutType" 
            class="sub-sidebar"
          />
          
          <div class="content-container" :style="{ backgroundColor: contentBgColor }">
            <router-view />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  transition: background-color 0.3s;
}

.app-container.top-layout {
  display: block;
}

.app-container.dark-theme {
  background-color: var(--el-bg-color-page);
}

.app-container.dark-theme .content-container {
  background-color: var(--el-bg-color-page);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-container {
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  transition: background-color 0.3s;
}

/* 顶部布局样式 */
.top-layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: background-color 0.3s, color 0.3s;
}

.dark-header {
  background-color: var(--el-bg-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.logo-area {
  display: flex;
  align-items: center;
}

.logo {
  height: 30px;
  margin-right: 10px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  transition: color 0.3s;
}

.body-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sub-sidebar {
  width: 220px;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.top-layout .content-container {
  height: calc(100vh - 60px);
  flex: 1;
}

.dark-theme .sub-sidebar {
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.3);
}
</style> 