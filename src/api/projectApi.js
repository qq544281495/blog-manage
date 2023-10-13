import request from '@/utils/request'
export default {
  createProject(data) {
    return request.post('/project/create', data)
  },
  // 获取文章列表
  searchProject(data) {
    return request.post('/project/search', data)
  },
  // 获取文章详情
  projectDetail(data) {
    return request.post('/project/detail', data)
  },
  // 更新文章
  updateProject(data) {
    return request.put('/project/update', data)
  },
  // 删除文章
  deleteProject(data) {
    return request.delete('/project/delete', data)
  },
  // 添加链接
  addLink(data) {
    return request.post('/project/addLink', data)
  },
  // 删除链接
  deleteLink(data) {
    return request.delete('/project/deleteLink', data)
  }
}
