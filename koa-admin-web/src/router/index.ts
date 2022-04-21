import { createWebHashHistory } from 'vue-router'
import { createRouter } from 'vue-router'

// TODO 菜单路由逻辑

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router