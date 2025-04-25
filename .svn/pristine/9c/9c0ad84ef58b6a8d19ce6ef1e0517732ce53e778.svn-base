// 导入图标组件
import { Menu, User, Setting } from '@element-plus/icons-vue'

/**
 * 系统路由和菜单统一配置
 * icon: 菜单图标
 * title: 菜单标题
 * path: 路由路径
 * component: 路由组件
 * meta: 路由元信息
 * children: 子路由/子菜单
 * hidden: 是否在菜单中隐藏
 */
export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
    hidden: true // 不在菜单中显示
  },
  {
    path: '/',
    component: () => import('../components/layout/AppLayout.vue'),
    redirect: '/dashboard',
    hidden: true // 根路由不在菜单中显示
  },
  {
    icon: Menu,
    title: '仪表盘',
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '仪表盘', requiresAuth: true }
  },
  {
    icon: User,
    title: '用户管理',
    path: '/users',
    name: 'UserManagement',
    component: () => import('../views/UserManagement.vue'),
    meta: { title: '用户管理', requiresAuth: true }
  },
  {
    icon: Setting,
    title: '平台配置',
    path: '/platformConfiguration',
    name: 'platformConfiguration',
    component: () => import('../components/layout/container/container.vue'),
    meta: { title: '平台配置', requiresAuth: true },
    children: [
      {
        icon: Setting,
        title: '数据校核',
        path: '/platformConfiguration/dataVerification',
        name: 'dataVerification',
        component: () => import('../components/layout/container/container.vue'),
        meta: { title: '数据校核', requiresAuth: true },
        children: [
          {
            icon: Setting,
            title: '校对报告下载',
            path: '/platformConfiguration/dataVerification/VerificationReport',
            name: 'VerificationReport',
            component: () => import('../views/platformConfiguration/dataVerification/VerificationReport.vue'),
            meta: { title: '校对报告下载', requiresAuth: true }
          },
          {
            icon: Setting,
            title: '原始数据包查询',
            path: '/platformConfiguration/dataVerification/OriginalDataQuery',
            name: 'OriginalDataQuery',
            component: () => import('../views/platformConfiguration/dataVerification/OriginalDataQuery.vue'),
            meta: { title: '原始数据包查询', requiresAuth: true }
          }
        ]
      },
      {
        icon: Setting,
        title: '数据初始化',
        path: '/platformConfiguration/dataInitialization',
        name: 'dataInitialization',
        component: () => import('../components/layout/container/container.vue'),
        meta: { title: '数据初始化', requiresAuth: true },
        children: [
          {
            icon: Setting,
            title: '支路管理',
            path: '/platformConfiguration/dataInitialization/BranchManagement',
            name: 'BranchManagement',
            component: () => import('../views/platformConfiguration/dataInitialization/BranchManagement.vue'),
            meta: { title: '支路管理', requiresAuth: true }
          },
          {
            icon: Setting,
            title: '分项管理',
            path: '/platformConfiguration/dataInitialization/ItemManagement',
            name: 'ItemManagement',
            component: () => import('../views/platformConfiguration/dataInitialization/ItemManagement.vue'),
            meta: { title: '分项管理', requiresAuth: true }
          }
        ]
      },
      {
        icon: Setting,
        title: '基础信息',
        path: '/platformConfiguration/baseInfo',
        name: 'baseInfo',
        component: () => import('../components/layout/container/container.vue'),
        meta: { title: '基础信息', requiresAuth: true },
        children: [
          {
            icon: Setting,
            title: '用户列表',
            path: '/platformConfiguration/baseInfo/userList',
            name: 'userList',
            component: () => import('../views/platformConfiguration/baseInfo/userList.vue'),
            meta: { title: '用户列表', requiresAuth: true }
          },
          {
            icon: Setting,
            title: '项目管理',
            path: '/platformConfiguration/baseInfo/projectsManagement',
            name: 'projectsManagement',
            component: () => import('../views/platformConfiguration/baseInfo/projectsManagement.vue'),
            meta: { title: '项目管理', requiresAuth: true }
          }
        ]
      },
      {
        icon: Setting,
        title: '系统设置',
        path: '/platformConfiguration/systemSettings',
        name: 'systemSettings',
        component: () => import('../components/layout/container/container.vue'),
        meta: { title: '系统设置', requiresAuth: true },
        children: [
          {
            icon: Setting,
            title: '信息公告',
            path: '/platformConfiguration/systemSettings/publicInformation',
            name: 'publicInformation',
            component: () => import('../views/platformConfiguration/systemSettings/publicInformation.vue'),
            meta: { title: '信息公告', requiresAuth: true }
          },
          {
            icon: Setting,
            title: '数据字典',
            path: '/platformConfiguration/systemSettings/dataDictionary',
            name: 'dataDictionary',
            component: () => import('../views/platformConfiguration/systemSettings/dataDictionary.vue'),
            meta: { title: '数据字典', requiresAuth: true }
          } 
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404', requiresAuth: false },
    hidden: true // 不在菜单中显示
  }
]

/**
 * 获取用于菜单显示的路由
 * @returns 过滤后的菜单项
 */
export const getMenuRoutes = () => {
  return routes.filter(route => !route.hidden)
}

/**
 * 获取路由表所需的格式化路由
 * @returns 格式化后的路由配置
 */
export const getFormattedRoutes = () => {
  const formattedRoutes = []
  
  // 添加登录路由
  const loginRoute = routes.find(r => r.path === '/login')
  if (loginRoute) {
    formattedRoutes.push(loginRoute)
  }
  
  // 添加主布局路由及其子路由
  const layoutRoute = routes.find(r => r.path === '/')
  if (layoutRoute) {
    // 创建一个新的主布局路由对象
    const mainRoute = {
      ...layoutRoute,
      children: []
    }
    
    // 将所有非隐藏路由添加为主布局的子路由
    routes.forEach(route => {
      if (route.path !== '/' && route.path !== '/login' && route.path !== '/:pathMatch(.*)*') {
        // 如果有子路由
        if (route.children) {
          const parentRoute = { ...route }
          delete parentRoute.children
          mainRoute.children.push(parentRoute)
          
          // 添加所有子路由
          route.children.forEach(child => {
            mainRoute.children.push(child)
          })
        } else {
          mainRoute.children.push(route)
        }
      }
    })
    
    formattedRoutes.push(mainRoute)
  }
  
  // 添加404路由
  const notFoundRoute = routes.find(r => r.path === '/:pathMatch(.*)*')
  if (notFoundRoute) {
    formattedRoutes.push(notFoundRoute)
  }
  
  return formattedRoutes
}

/**
 * 获取指定路径的路由信息
 * @param {string} path 路由路径
 * @returns 路由配置对象
 */
export const getRouteByPath = (path) => {
  // 在顶级路由中查找
  const route = routes.find(r => r.path === path)
  if (route) return route
  
  // 在子路由中查找
  for (const r of routes) {
    if (r.children) {
      const childRoute = r.children.find(child => child.path === path)
      if (childRoute) return childRoute
    }
  }
  
  return null
}

/**
 * 获取指定路径的父路由
 * @param {string} path 子路由路径
 * @returns 父路由对象
 */
export const getParentRoute = (path) => {
  // 直接父级查找
  for (const route of routes) {
    if (route.children) {
      const isDirectChild = route.children.some(child => child.path === path)
      if (isDirectChild) return route
      
      // 递归查找更深层级的子菜单
      for (const child of route.children) {
        if (child.children) {
          const result = findParentInChildren(child, path)
          if (result) return result
        }
      }
    }
  }
  
  return null
}

/**
 * 递归查找子菜单中的父级
 * @param {Object} parent 父级菜单
 * @param {string} path 要查找的路径
 * @returns 父级菜单对象
 */
const findParentInChildren = (parent, path) => {
  if (parent.children) {
    const isDirectChild = parent.children.some(child => child.path === path)
    if (isDirectChild) return parent
    
    // 继续向下递归查找
    for (const child of parent.children) {
      if (child.children) {
        const result = findParentInChildren(child, path)
        if (result) return result
      }
    }
  }
  
  return null
}

/**
 * 判断路由是否有子路由
 * @param {string} path 路由路径
 * @returns 布尔值
 */
export const hasChildRoutes = (path) => {
  // 递归查找指定路径的菜单项
  const findRouteByPath = (items, targetPath) => {
    for (const item of items) {
      if (item.path === targetPath) {
        return item
      }
      
      if (item.children && item.children.length > 0) {
        const result = findRouteByPath(item.children, targetPath)
        if (result) return result
      }
    }
    
    return null
  }
  
  const route = findRouteByPath(routes, path)
  return !!(route && route.children && route.children.length > 0)
}

export default routes 