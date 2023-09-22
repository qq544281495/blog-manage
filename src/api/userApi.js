/**
 * 用户接口
 */
import request from '@/utils/request'
export default {
  // 登录接口
  login(data) {
    return request.post('/user/login', data)
  }
}
