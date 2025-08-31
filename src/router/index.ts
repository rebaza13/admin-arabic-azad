import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from '../stores/auth-store'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Authentication guard
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Wait for auth to be initialized to prevent flash
    if (!authStore.initialized) {
      await authStore.getCurrentUser()
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth !== false) {
      // If not authenticated, redirect to login
      if (!authStore.isAuthenticated) {
        next('/login')
        return
      }

      // Check if user is teacher (for admin routes)
      if (to.meta.requiresTeacher && !authStore.isTeacher) {
        next('/dashboard')
        return
      }
    }

    // If already authenticated and trying to access login, redirect to dashboard
    if (to.path === '/login' && authStore.isAuthenticated) {
      next('/dashboard')
      return
    }

    next()
  })

  return Router
})
