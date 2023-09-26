/**
 * 文章接口
 */
import request from '@/utils/request'
export default {
  // 创建分类
  createClassify(data) {
    return request.post('/classify/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  // 查询分类
  searchClassify(data) {
    return request.post('/classify/search', data)
  },
  // 删除分类
  deleteClassify(data) {
    return request.delete('/classify/delete', data)
  },
  // 编辑分类
  editClassify(data) {
    return request.put('/classify/update', data)
  }
}
