/**
 * 文章接口
 */
import request from '@/utils/request'
export default {
  // 文章图片上传
  uploadImage(data) {
    return request.post('/article/uploadImage', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  // 文章图片删除
  deleteImage(data) {
    return request.delete('/article//deleteImage', data)
  },
  // 文章上传
  uploadArticle(data) {
    return request.post('/article/uploadArticle', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  // 获取文章列表
  searchArticle(data) {
    return request.post('/article/search', data)
  },
  // 获取文章详情
  articleDetail(data) {
    return request.post('/article/detail', data)
  },
  // 更新文章
  updateArticle(data) {
    return request.put('/article/update', data)
  },
  // 删除文章
  deleteArticle(data) {
    return request.delete('/article/delete', data)
  }
}
