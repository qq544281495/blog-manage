import './assets/style/base.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'
import store from './store'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ElMessage } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)

app.use(router).use(store).use(mavonEditor).use(ElementPlus, { locale: zhCn })

app.config.globalProperties.$api = api
app.config.globalProperties.$message = ElMessage
// 引入所有element icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
