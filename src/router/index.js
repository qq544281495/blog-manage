import { createRouter, createWebHistory } from 'vue-router'
import storage from '@/utils/storage'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/LoginView.vue')
        }
      ]
    },
    {
      path: '/content',
      name: 'content',
      component: () => import('../views/ContentView.vue'),
      children: [
        {
          path: '/editArticle',
          name: 'editArticle',
          component: () => import('../views/article/EditArticle.vue')
        },
        {
          path: '/manageArticle',
          name: 'manageArticle',
          component: () => import('../views/article/ManageArticle.vue')
        },
        {
          path: '/articleComment',
          name: 'articleComment',
          component: () => import('../views/article/ArticleComment.vue')
        },
        {
          path: '/editProject',
          name: 'editProject',
          component: () => import('../views/project/EditProject.vue')
        },
        {
          path: '/manageProject',
          name: 'manageProject',
          component: () => import('../views/project/ManageProject.vue')
        },
        {
          path: '/label',
          name: 'label',
          component: () => import('../views/LabelView.vue')
        },
        {
          path: '/classify',
          name: 'classify',
          component: () => import('../views/ClassifyView.vue')
        }
      ]
    }
  ]
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  if (to.name != 'login') {
    let user = storage.getItem('user')
    if (JSON.stringify(user) === '{}') {
      ElMessage.error('请重新登录后操作')
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
