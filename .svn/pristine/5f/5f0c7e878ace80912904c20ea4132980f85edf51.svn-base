import { request } from '@/utils/http/axios'

// 获取模块样式列表
export const getModuleStyleList = () => {
  console.log('%c🌈 request! 🌈', 'color: green; font-size: 18px;', request);
  
  return request({
    url: '/api/moduleStyle/getList',
    method: 'get'
  })
}
// 登录接口
export const login = (data) => {
  return request({
    url: '/api/index/login',
    method: 'post',
    data,
    contentType: 'form',
    showLoading: true,
    silent: true
    
  })
}
