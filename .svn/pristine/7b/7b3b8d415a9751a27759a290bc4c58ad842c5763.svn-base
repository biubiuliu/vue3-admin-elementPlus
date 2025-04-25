import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 定义默认主题颜色
const defaultThemeColors = {
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399',
}

// 主题存储
export const useThemeStore = defineStore('theme', () => {
  // 主题颜色
  const primaryColor = ref(localStorage.getItem('theme_primaryColor') || defaultThemeColors.primary)
  // 布局类型
  const layoutType = ref(localStorage.getItem('layoutType') || 'sidebar')
  // 菜单是否折叠
  const isCollapsed = ref(localStorage.getItem('isCollapsed') === 'true')
  // 主题模式（light/dark）
  const themeMode = ref(localStorage.getItem('themeMode') || 'light')

  // 更新主题颜色
  const updatePrimaryColor = (color) => {
    primaryColor.value = color
    localStorage.setItem('theme_primaryColor', color)
    applyThemeColor(color)
  }

  // 切换布局类型
  const updateLayoutType = (type) => {
    layoutType.value = type
    localStorage.setItem('layoutType', type)
  }

  // 切换折叠状态
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('isCollapsed', isCollapsed.value)
  }

  // 更改主题模式
  const updateThemeMode = (mode) => {
    themeMode.value = mode
    localStorage.setItem('themeMode', mode)
    document.documentElement.setAttribute('data-theme', mode)
    
    // 在切换主题模式时重新应用主题颜色，确保色阶正确
    applyThemeColor(primaryColor.value)
  }

  // 应用主题颜色到 Element Plus
  const applyThemeColor = (color) => {
    const styles = document.documentElement.style
    
    // 设置 CSS 变量
    styles.setProperty('--el-color-primary', color)
    
    // 计算并设置RGB值（用于rgba透明色计算）
    const rgb = hexToRgb(color)
    styles.setProperty('--el-color-primary-rgb', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`)
    
    // 生成不同的色阶
    for (let i = 1; i <= 9; i++) {
      const lightColor = getLightColor(color, i / 10)
      styles.setProperty(`--el-color-primary-light-${i}`, lightColor)
    }
    
    // 设置暗色
    const darkColor = getDarkColor(color, 0.1)
    styles.setProperty('--el-color-primary-dark-2', darkColor)
  }

  // 获取较浅的颜色
  const getLightColor = (color, level) => {
    const rgb = hexToRgb(color)
    for (let i in rgb) {
      rgb[i] = Math.round(255 - level * (255 - rgb[i]))
    }
    return rgbToHex(rgb)
  }

  // 获取较深的颜色
  const getDarkColor = (color, level) => {
    const rgb = hexToRgb(color)
    for (let i in rgb) {
      rgb[i] = Math.round(rgb[i] * (1 - level))
    }
    return rgbToHex(rgb)
  }

  // 十六进制转 RGB
  const hexToRgb = (hex) => {
    hex = hex.replace('#', '')
    const rgb = []
    for (let i = 0; i < 3; i++) {
      rgb[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
    }
    return rgb
  }

  // RGB 转十六进制
  const rgbToHex = (rgb) => {
    let hex = '#'
    for (let i = 0; i < 3; i++) {
      let value = rgb[i].toString(16)
      if (value.length === 1) {
        value = '0' + value
      }
      hex += value
    }
    return hex
  }

  // 初始化主题
  const initTheme = () => {
    applyThemeColor(primaryColor.value)
    document.documentElement.setAttribute('data-theme', themeMode.value)
  }

  // 在主题颜色变化时应用
  watch(primaryColor, (newColor) => {
    applyThemeColor(newColor)
  }, { immediate: true })

  return {
    primaryColor,
    layoutType,
    isCollapsed,
    themeMode,
    updatePrimaryColor,
    updateLayoutType,
    toggleCollapse,
    updateThemeMode,
    initTheme
  }
}) 