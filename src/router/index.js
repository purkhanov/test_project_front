import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '',
    name: 'main',
    meta: { auth: false },
    component: () => import('@/views/MainPage.vue')
  },
  {
    name: 'auth',
    meta: { auth: false },
    children: [
      {
        path: '/sign-up',
        name: 'sign-up',
        component: () => import('@/views/auth/SignUp.vue')
      },
      {
        path: '/sign-in',
        name: 'sign-in',
        component: () => import('@/views/auth/SignIn.vue')
      },
      {
        path: '/verify/:email/:code',
        name: 'verify',
        component: () => import('@/views/auth/Created.vue')
      }
    ]
  },
  {
    name: 'user',
    meta: { auth: true },
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: '/animals',
        name: 'animal',
        component: () => import('@/views/Animals.vue')
      },
      {
        path: '/breeds',
        name: 'breed',
        component: () => import('@/views/Breed.vue')
      },
      {
        path: '/weightings',
        name: 'weighting',
        component: () => import('@/views/Weighting.vue')
      },
      {
        path: '/animaltypes',
        name: 'animaltype',
        component: () => import('@/views/AnimalType.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/User.vue')
      }
    ]
  },
  {
    name: 'admin',
    meta: { auth: true },
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: '/admin/users',
        name: 'users',
        component: () => import('@/views/Users.vue')
      },
      {
        path: '/admin/weightings',
        name: 'adminWeightings',
        component: () => import('@/views/AdminWeighting.vue')
      },
      {
        path: '/admin/profile',
        name: 'adminProfile',
        component: () => import('@/views/User.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.auth && !authStore.tokenJWT) {
    return { name: 'sign-in'}
  } else {
    return true
  }
})

export default router
