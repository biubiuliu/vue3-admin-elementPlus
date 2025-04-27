/**
 * token存储的key
 */
const TOKEN_KEY = 'token'

/**
 * token过期时间的key
 */
const EXPIRES_KEY = 'token_expires'

/**
 * 获取token
 * @returns {string} token值
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置token，并保存过期时间
 * @param {string} token - token值
 * @param {number} expires - 过期时间（秒）
 */
export function setToken(token, expires = 7200) {
  localStorage.setItem(TOKEN_KEY, token)
  
  // 计算过期时间并存储（转为毫秒）
  const expiresTime = Date.now() + expires * 1000
  localStorage.setItem(EXPIRES_KEY, expiresTime.toString())
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

/**
 * 检查token是否有效（是否过期）
 * @returns {boolean} 是否有效
 */
export function isTokenValid() {
  const token = getToken()
  if (!token) {
    return false
  }
  
  // 检查是否过期
  const expires = localStorage.getItem(EXPIRES_KEY)
  if (!expires) {
    return false
  }
  
  return Date.now() < parseInt(expires)
} 