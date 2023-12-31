/**
 * 文章接口
 */
import request from '@/utils/request'
export default {
  // 文章图片上传
  uploadImage(data) {
    return request.post('/operateImage/uploadImage', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  // 文章图片删除
  deleteImage(data) {
    return request.delete('/operateImage/deleteImage', data)
  }
}
