// axios封装
import axios from 'axios'
import config from '@/config'
// import { ElMessage } from 'element-plus'
// import router from '@/router'
import storage from './storage'

// 创建axios实例对象
const service = axios.create({
  baseURL: config.baseURL,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use((request) => {
  const headers = request.headers
  let token = ''
  if (storage.getItem('user')) {
    token = storage.getItem('user').token || ''
  }
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token
  return request
})

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 用户操作错误
    if (error.response.status === 400) {
      return error.response.data
    }
    if (error.response.status === 401) {
      console.log('登录超时或未登录')
    }
  }
)

// 请求方法
function request(options) {
  options.method = options.method || 'get'
  // 当为get请求时将data赋值给params，请求直接传入data
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  if (config.env === 'production') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.baseApi
  }
  return service(options)
}

let requestMethod = ['get', 'post', 'put', 'delete', 'patch']
requestMethod.forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      method: item,
      data,
      ...options
    })
  }
})

export default request
