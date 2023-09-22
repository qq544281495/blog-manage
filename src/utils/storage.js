import config from '@/config'

export default {
  // 获取storage所有值
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
  },
  // 添加storage值
  setItem(key, value) {
    let storage = this.getStorage()
    storage[key] = value
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  // 获取storage指定值
  getItem(key) {
    return this.getStorage()[key]
  },
  clearItem(key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.removeItem(config.namespace, JSON.stringify(storage))
  },
  clearAll() {
    window.localStorage.clear()
  }
}
