import storage from '@/utils/storage'
export default {
  namespaced: true,
  state: () => ({
    user: storage.getItem('user') || {}
  }),
  getters: {
    GET_USER(state) {
      return state.user
    }
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data
      storage.setItem('user', data)
    }
  },
  actions: {}
}
