/**
 * 文章接口
 */
import request from '@/utils/request'
export default {
  // 登录接口
  uploadImage(data) {
    return request.post('/article/uploadImage', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteImage(data) {
    return request.delete('/article//deleteImage', data)
  }
}
