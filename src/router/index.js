import { createRouter, createWebHistory } from 'vue-router'
import { getFormattedRoutes } from './config'

// 从配置文件获取格式化后的路由表
const routes = getFormattedRoutes()

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 管理系统` : '管理系统'
  
  // 判断是否需要登录权限
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      // 未登录，重定向到登录页
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else {
    next()
  }
})

export default router 