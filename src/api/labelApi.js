/**
 * 标签接口
 */
import request from '@/utils/request'
export default {
  // 创建标签
  createLabel(data) {
    return request.post('/label/create', data)
  },
  // 查询标签
  searchLabel(data) {
    return request.post('/label/search', data)
  },
  updateLabel(data) {
    return request.put('/label/update', data)
  },
  deleteLabel(data) {
    return request.delete('/label/delete', data)
  }
}
