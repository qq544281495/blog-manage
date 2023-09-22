// 环境配置封装
const env = import.meta.env.MODE || 'production'
const config = {
  development: {
    baseApi: '/api'
  },
  production: {
    baseApi: '/api'
  }
}

export default {
  env,
  ...config[env],
  namespace: 'blog',
  imageBaseUrl: 'http://localhost:8000'
}
