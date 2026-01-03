import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import CustomModules from '../views/CustomModules.vue'
import DynamicProject from '../views/DynamicProject.vue'
import Welcome from '../views/Welcome.vue'
import Bazi from '../views/Bazi.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/welcome',
        },
        {
          path: 'welcome',
          name: 'welcome',
          component: Welcome,
        },
        {
          path: 'custom',
          name: 'custom',
          component: CustomModules,
        },
        {
          path: 'project/:id',
          name: 'project-detail',
          component: DynamicProject,
        },
        {
          path: 'bazi',
          name: 'bazi',
          component: Bazi,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
