import axios from 'axios'
import { isFunction, isObject, isString } from '@/utils/is'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'
import qs from 'qs'

// 用于存储请求的Map对象
const pendingMap = new Map()

// 全局默认配置
const defaultConfig = {
  // 请求内容类型
  contentType: 'application/json',
  // 是否显示loading
  showLoading: false,
  // loading配置
  loading: {
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  },
  // 是否显示错误提示
  showError: true,
  // 是否静默失败（不提示错误）
  silent: false,
  // 成功提示
  showSuccess: false,
  // 自定义成功提示消息
  successMsg: '',
  // 自定义错误提示消息
  errorMsg: '',
  // 重试次数
  retryCount: 0,
  // 超时时间
  timeout: 10000
}

// 全局loading计数器
let loadingCount = 0
let loadingInstance = null

/**
 * 显示全局loading
 * @param {Object} options loading配置
 */
function showLoading(options = {}) {
  if (loadingCount === 0) {
    // 这里可以替换为任意UI库的loading实现
    // 例如Element Plus:
    // loadingInstance = ElLoading.service({
    //   text: options.text || '加载中...',
    //   background: options.background || 'rgba(0, 0, 0, 0.7)'
    // })
    
    console.log('显示loading:', options)
    // TODO: 实现实际的loading效果
  }
  loadingCount++
}

/**
 * 隐藏全局loading
 */
function hideLoading() {
  if (loadingCount <= 0) return
  
  loadingCount--
  if (loadingCount === 0) {
    // 这里关闭loading
    // 例如Element Plus:
    // loadingInstance.close()
    // loadingInstance = null
    
    console.log('隐藏loading')
    // TODO: 实现实际的loading关闭
  }
}

/**
 * 显示错误提示
 * @param {string} message 错误信息
 */
function showErrorMessage(message) {
  // 这里可以替换为任意UI库的消息提示
  // 例如Element Plus:
  ElMessage.error(message)
  
  console.error('错误提示:', message)
  // TODO: 实现实际的错误提示
}

/**
 * 显示成功提示
 * @param {string} message 成功信息
 */
function showSuccessMessage(message) {
  // 例如Element Plus:
  ElMessage.success(message)
  
  console.log('成功提示:', message)
  // TODO: 实现实际的成功提示
}

/**
 * 合并配置
 * @param {Object|string} options 配置项或内容类型字符串
 * @returns {Object} 合并后的配置
 */
function mergeConfig(options) {
  // 如果options是字符串，视为contentType
  if (isString(options)) {
    return { ...defaultConfig, contentType: options }
  }
  
  // 合并配置
  return { ...defaultConfig, ...options }
}

/**
 * 生成唯一的请求标识
 * @param {AxiosRequestConfig} config Axios请求配置
 * @returns {string} 请求标识
 */
function getPendingKey(config) {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 将请求添加到pendingMap中
 * @param {AxiosRequestConfig} config Axios请求配置
 */
function addPending(config) {
  const pendingKey = getPendingKey(config)
  if (!pendingMap.has(pendingKey)) {
    // 若不存在相同请求，添加到pendingMap
    config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
      pendingMap.set(pendingKey, cancel)
    })
  } else {
    // 若存在相同请求，取消当前请求
    config.cancelToken = new axios.CancelToken(cancel => {
      cancel(`重复请求: ${pendingKey}`)
    })
  }
}

/**
 * 从pendingMap中移除请求
 * @param {AxiosRequestConfig} config Axios请求配置
 */
function removePending(config) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    pendingMap.delete(pendingKey)
  }
}

// 创建axios实例
const axiosInstance = axios.create({
  // 使用vite.config.js中配置的代理前缀
  baseURL: '/api',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 检查并处理重复请求
    addPending(config)
    
    // 添加token认证信息
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求拦截错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    // 请求完成后，移除请求标识
    removePending(response.config)
    
    // 根据接口返回的状态码处理响应
    const { data } = response
    
    // 调试信息
    console.log('接口响应数据:', data)
    
    // 根据实际接口调整状态码判断，这里使用 code 作为状态码字段名
    // 如果后端不是使用 code 字段返回状态，请根据实际情况修改
    if (data.code === 200 || data.code === 0 || data.status === 200 || data.success === true) {
      // 根据实际接口返回格式调整，返回 data 或 data.data
      return data.data !== undefined ? data.data : data
    }
    
    // 处理业务错误
    const message = data.message || data.msg || '请求失败'
    console.error('业务错误:', message)
    return Promise.reject(new Error(message))
  },
  error => {
    // 请求被取消的情况
    if (axios.isCancel(error)) {
      console.log('请求被取消:', error.message)
      return Promise.reject(error)
    }
    
    // 请求错误时移除请求标识
    error.config && removePending(error.config)
    
    // 错误详情记录
    console.error('请求错误:', error)
    
    // 获取错误信息
    let errorMsg = '请求失败，请稍后重试'
    
    if (error.response) {
      const { status } = error.response
      
      // 处理401未授权（token无效或过期）
      if (status === 401) {
        errorMsg = '登录已过期，请重新登录'
        
        // 清除token
        removeToken()
        
        // 记录当前路由，以便登录后返回
        const currentPath = router.currentRoute.value.fullPath
        
        // 如果不是登录页，则跳转到登录页
        if (router.currentRoute.value.path !== '/login') {
          router.push({
            path: '/login',
            query: { redirect: currentPath }
          })
        }
      } else {
        errorMsg = {
          400: '请求参数错误',
          403: '无权访问',
          404: '请求的资源不存在',
          500: '服务器内部错误',
        }[status] || `请求失败(${status})`
      }
      
      // 尝试从响应中获取详细错误信息
      if (error.response.data) {
        const data = error.response.data
        if (data.message || data.msg) {
          errorMsg = data.message || data.msg
        }
      }
    } else if (error.message) {
      // 请求超时或网络错误
      if (error.message.includes('timeout')) {
        errorMsg = '请求超时'
      } else if (error.message.includes('Network')) {
        errorMsg = '网络错误'
      }
      errorMsg = error.message
    }
    
    return Promise.reject(new Error(errorMsg))
  }
)

/**
 * 封装请求方法
 * @param {Object} options 请求配置选项
 * @returns {Promise} 请求Promise
 */
export function request(options) {
  // 提取并合并自定义配置
  const customOptions = {
    contentType: options.contentType || defaultConfig.contentType,
    showLoading: options.showLoading,
    loading: options.loading,
    showError: options.showError,
    silent: options.silent,
    showSuccess: options.showSuccess,
    successMsg: options.successMsg,
    errorMsg: options.errorMsg,
    retryCount: options.retryCount,
    timeout: options.timeout
  }
  
  // 设置超时时间
  if (customOptions.timeout && customOptions.timeout !== defaultConfig.timeout) {
    options.timeout = customOptions.timeout
  }
  
  // 根据contentType处理请求数据
  if (options.data && customOptions.contentType) {
    const contentType = customOptions.contentType
    
    // 设置请求头的Content-Type
    if (!options.headers) {
      options.headers = {}
    }
    
    // 处理不同的内容类型
    if (contentType === 'form' || contentType === 'application/x-www-form-urlencoded') {
      options.data = qs.stringify(options.data)
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else if (contentType === 'multipart' || contentType === 'multipart/form-data') {
      // FormData类型保持不变，但设置正确的Content-Type
      options.headers['Content-Type'] = 'multipart/form-data'
    } else {
      // 默认为JSON
      options.headers['Content-Type'] = contentType
    }
  }
  
  // 显示loading
  if (customOptions.showLoading) {
    showLoading(customOptions.loading)
  }
  
  if (isFunction(options.beforeRequest)) {
    options = options.beforeRequest(options)
  }
  
  return axiosInstance(options)
    .then(res => {
      // 隐藏loading
      if (customOptions.showLoading) {
        hideLoading()
      }
      
      // 显示成功提示
      if (customOptions.showSuccess && customOptions.successMsg) {
        showSuccessMessage(customOptions.successMsg)
      }
      
      if (isFunction(options.afterRequest)) {
        return options.afterRequest(res)
      }
      return res
    })
    .catch(error => {
      // 隐藏loading
      if (customOptions.showLoading) {
        hideLoading()
      }
      
      // 显示错误提示
      if (!customOptions.silent && customOptions.showError) {
        const errorMessage = customOptions.errorMsg || error.message
        showErrorMessage(errorMessage)
      }
      
      return Promise.reject(error)
    })
}

/**
 * 封装基本请求方法
 */
export default {
  /**
   * GET请求
   * @param {string} url 请求地址
   * @param {Object} params 请求参数
   * @param {Object|string} config 请求配置
   * @returns {Promise} 请求Promise
   */
  get: (url, params, config = {}) => {
    // 处理配置
    const mergedConfig = mergeConfig(config)
    
    return request({
      method: 'GET',
      url,
      params,
      ...mergedConfig
    })
  },
  
  /**
   * 标准POST请求（JSON格式）
   * @param {string} url 请求地址
   * @param {Object} data 请求数据
   * @param {Object|string} config 请求配置
   * @returns {Promise} 请求Promise
   */
  post: (url, data, config = {}) => {
    // 处理配置
    const mergedConfig = mergeConfig(config)
    
    // 确保默认为JSON格式
    if (!mergedConfig.contentType) {
      mergedConfig.contentType = 'application/json'
    }
    
    return request({
      method: 'POST',
      url,
      data,
      ...mergedConfig
    })
  },
  
  /**
   * 表单POST请求（application/x-www-form-urlencoded）
   * @param {string} url 请求地址
   * @param {Object} data 请求数据
   * @param {Object|string} config 请求配置
   * @returns {Promise} 请求Promise
   */
  postForm: (url, data, config = {}) => {
    // 处理配置并设置为表单格式
    const mergedConfig = mergeConfig(config)
    mergedConfig.contentType = 'application/x-www-form-urlencoded'
    
    return request({
      method: 'POST',
      url,
      data,
      ...mergedConfig
    })
  },
  
  /**
   * 根据配置自动选择适合的请求方式
   * @param {string} url 请求地址
   * @param {Object} data 请求数据
   * @param {Object|string} config 请求配置或内容类型字符串
   * @returns {Promise} 请求Promise
   */
  postAuto: (url, data, config = {}) => {
    // 处理配置，contentType在request方法中处理
    const mergedConfig = mergeConfig(config)
    
    return request({
      method: 'POST',
      url,
      data,
      ...mergedConfig
    })
  },
  
  /**
   * PUT请求
   * @param {string} url 请求地址
   * @param {Object} data 请求数据
   * @param {Object|string} config 请求配置
   * @returns {Promise} 请求Promise
   */
  put: (url, data, config = {}) => {
    // 处理配置
    const mergedConfig = mergeConfig(config)
    
    return request({
      method: 'PUT',
      url,
      data,
      ...mergedConfig
    })
  },
  
  /**
   * DELETE请求
   * @param {string} url 请求地址
   * @param {Object} params 请求参数
   * @param {Object|string} config 请求配置
   * @returns {Promise} 请求Promise
   */
  delete: (url, params, config = {}) => {
    // 处理配置
    const mergedConfig = mergeConfig(config)
    
    return request({
      method: 'DELETE',
      url,
      params,
      ...mergedConfig
    })
  },
  
  /**
   * 文件上传请求
   * @param {string} url 请求地址
   * @param {File|Object} file 文件对象或包含文件的数据对象
   * @param {Object|string} config 请求配置
   * @returns {Promise} 请求Promise
   */
  upload: (url, file, config = {}) => {
    // 处理上传文件
    let formData
    if (file instanceof FormData) {
      formData = file
    } else {
      formData = new FormData()
      if (file instanceof File) {
        formData.append('file', file)
      } else if (isObject(file)) {
        // 如果是对象，则遍历添加到FormData
        Object.keys(file).forEach(key => {
          formData.append(key, file[key])
        })
      }
    }
    
    // 合并配置并默认显示loading
    const defaultUploadConfig = {
      showLoading: true,
      contentType: 'multipart/form-data'
    }
    const mergedConfig = mergeConfig({...defaultUploadConfig, ...config})
    
    return request({
      method: 'POST',
      url,
      data: formData,
      ...mergedConfig
    })
  }
}
