<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bell, Fold, Expand, Setting } from '@element-plus/icons-vue'
import { getMenuRoutes, hasChildRoutes } from '../../router/config'
import { useThemeStore } from '../../stores/theme'

// 使用主题 store
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

// 定义折叠事件
const emit = defineEmits(['toggleCollapse'])

const toggleSidebar = () => {
  emit('toggleCollapse')
  themeStore.toggleCollapse()
}

const router = useRouter()
const route = useRoute()

// 从统一配置获取所有可见菜单项
const fullMenuItems = getMenuRoutes()

// 顶级菜单项（只显示父级）
const topMenuItems = fullMenuItems.map(item => ({
  path: item.path,
  name: item.title
}))

// 计算当前活动菜单
const activeMenu = computed(() => {
  // 从当前路径中提取顶级路径
  const pathParts = route.path.split('/')
  return pathParts.length > 1 ? `/${pathParts[1]}` : '/'
})

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

// 处理菜单点击，对于有子路由的菜单自动跳转到第一个子路由
const handleMenuClick = (menuPath) => {
  // 检查是否有子路由
  const hasChildren = hasChildRoutes(menuPath)
  
  if (hasChildren) {
    // 找到当前点击的菜单项
    const menuItem = fullMenuItems.find(item => item.path === menuPath)
    
    // 如果找到且有子菜单，递归查找第一个可点击的子菜单
    if (menuItem && menuItem.children && menuItem.children.length > 0) {
      const targetPath = findFirstClickableSubmenu(menuItem)
      router.push(targetPath)
    } else {
      // 直接跳转到当前路径
      router.push(menuPath)
    }
  } else {
    // 没有子菜单，直接跳转到当前路径
    router.push(menuPath)
  }
}

const userDropdownVisible = ref(false)
const user = ref({
  name: '管理员',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})

const handleCommand = (command) => {
  if (command === 'logout') {
    // 退出登录逻辑
    console.log('退出登录')
  } else if (command === 'profile') {
    // 个人资料逻辑
    console.log('查看个人资料')
  }
}

// 布局选项
const layoutOptions = [
  { label: '侧边栏布局', value: 'sidebar' },
  { label: '顶部导航布局', value: 'top' }
]

// 主题模式选项
const themeModeOptions = [
  { label: '亮色主题', value: 'light' },
  { label: '暗色主题', value: 'dark' }
]

// 主题设置对话框
const themeSettingsVisible = ref(false)

// 切换布局方式
const switchLayout = (layout) => {
  themeStore.updateLayoutType(layout)
  setTimeout(() => {
    window.location.reload()
  }, 300)
}

// 切换主题模式
const switchThemeMode = (mode) => {
  themeStore.updateThemeMode(mode)
}

// 预定义的主题颜色
const predefinedColors = [
  '#409EFF', // 蓝色（默认）
  '#67C23A', // 绿色
  '#E6A23C', // 黄色
  '#F56C6C', // 红色
  '#909399', // 灰色
  '#7B54EA', // 紫色
  '#1ABC9C', // 青绿色
  '#3498DB', // 天蓝色
  '#9B59B6', // 紫罗兰
  '#FF6B6B'  // 粉红色
]

// 选择主题颜色
const selectThemeColor = (color) => {
  themeStore.updatePrimaryColor(color)
}
</script>

<template>
  <div 
    class="header" 
    :class="{ 
      'top-layout-header': layoutType === 'top',
      'dark-theme': themeStore.themeMode === 'dark'
    }"
    :style="{
      backgroundColor: themeStore.themeMode === 'dark' ? '#141414' : '#ffffff',
      color: themeStore.themeMode === 'dark' ? '#ffffff' : '#303133'
    }"
  >
    <!-- 侧边栏布局的头部 -->
    <template v-if="layoutType === 'sidebar'">
      <div class="left-area">
        <!-- 折叠按钮 -->
        <div class="toggle-btn" @click="toggleSidebar">
          <el-icon v-if="isCollapse"><Expand /></el-icon>
          <el-icon v-else><Fold /></el-icon>
        </div>
        
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>仪表盘</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </template>
    
    <!-- 顶部布局的头部 -->
    <template v-else>
      <div class="top-menu">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :background-color="themeStore.themeMode === 'dark' ? '#141414' : '#ffffff'"
          :text-color="themeStore.themeMode === 'dark' ? '#ffffff' : '#303133'"
          :active-text-color="themeStore.primaryColor"
        >
          <el-menu-item 
            v-for="item in topMenuItems" 
            :key="item.path" 
            :index="item.path"
            @click="handleMenuClick(item.path)"
          >
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </div>
    </template>
    
    <div class="right-menu">
      <!-- 主题设置按钮 -->
      <div class="right-menu-item">
        <el-tooltip content="主题设置" placement="bottom">
          <el-icon @click="themeSettingsVisible = true"><Setting /></el-icon>
        </el-tooltip>
      </div>
      
      <div class="right-menu-item">
        <el-tooltip content="通知中心" placement="bottom">
          <el-badge :value="3" class="badge-item">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </el-tooltip>
      </div>
      
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="user.avatar" />
          <span 
            class="user-name"
            :style="{ color: themeStore.themeMode === 'dark' ? '#ffffff' : '#303133' }"
          >
            {{ user.name }}
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人资料</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    
    <!-- 主题设置对话框 -->
    <el-dialog
      v-model="themeSettingsVisible"
      title="系统主题设置"
      width="500px"
    >
      <div class="theme-settings">
        <!-- 布局设置 -->
        <div class="setting-section">
          <h3 class="setting-title">布局设置</h3>
          <div class="layout-options">
            <el-radio-group v-model="themeStore.layoutType" @change="switchLayout">
              <el-radio
                v-for="option in layoutOptions"
                :value="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 主题模式 -->
        <div class="setting-section">
          <h3 class="setting-title">主题模式</h3>
          <div class="theme-mode-options">
            <el-radio-group v-model="themeStore.themeMode" @change="switchThemeMode">
              <el-radio
                v-for="option in themeModeOptions"
                :value="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 主题颜色 -->
        <div class="setting-section">
          <h3 class="setting-title">主题颜色</h3>
          <div class="color-picker">
            <div
              v-for="(color, index) in predefinedColors"
              :key="index"
              class="color-item"
              :style="{ backgroundColor: color }"
              :class="{ 'active': themeStore.primaryColor === color }"
              @click="selectThemeColor(color)"
            ></div>
          </div>
          
          <div class="custom-color">
            <span>自定义颜色：</span>
            <el-color-picker
              v-model="themeStore.primaryColor"
              show-alpha
              @change="selectThemeColor"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="themeSettingsVisible = false">取消</el-button>
          <el-button type="primary" @click="themeSettingsVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.header {
  height: 60px;
  box-sizing: content-box;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.header.dark-theme {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--el-border-color);
}

.top-layout-header {
  padding: 0;
  box-shadow: none;
  flex: 1;
}

.left-area {
  display: flex;
  align-items: center;
}

.toggle-btn {
  margin-right: 15px;
  cursor: pointer;
  font-size: 18px;
}

.breadcrumb {
  display: inline-block;
}

.top-menu {
  flex: 1;
}

.right-menu {
  display: flex;
  align-items: center;
}

.right-menu-item {
  padding: 0 12px;
  cursor: pointer;
  font-size: 20px;
}

.badge-item {
  font-size: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin-left: 8px;
  font-size: 14px;
  transition: color 0.3s;
}

/* 主题设置样式 */
.theme-settings {
  padding: 0 20px;
}

.setting-section {
  margin-bottom: 24px;
}

.setting-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #303133;
  position: relative;
  padding-left: 10px;
}

.setting-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  height: 16px;
  width: 4px;
  background-color: var(--el-color-primary);
  border-radius: 2px;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.color-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border: 2px solid transparent;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border-color: #909399;
}

.color-item.active::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 10px;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transform: rotate(45deg);
  left: 7px;
  top: 4px;
}

.custom-color {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.custom-color span {
  margin-right: 10px;
}

.dialog-footer {
  padding-top: 10px;
  text-align: right;
}

/* 暗黑模式样式调整 */
.dark-theme .setting-title {
  color: var(--el-text-color-primary);
}

:deep(.el-breadcrumb__item) {
  color: inherit;
}

:deep(.el-breadcrumb__inner) {
  color: inherit;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 60px;
  line-height: 60px;
}
</style> 