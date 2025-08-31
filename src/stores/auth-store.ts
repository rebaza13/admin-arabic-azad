import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false) // Track if auth state has been initialized

  const isAuthenticated = computed(() => !!user.value)
  const isTeacher = computed(() => user.value?.user_metadata?.role === 'teacher')

  async function signIn(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      user.value = data.user
      session.value = data.session

      return { success: true }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تسجيل الدخول'
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string, name: string) {
    loading.value = true
    error.value = null

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'teacher'
          }
        }
      })

      if (signUpError) throw signUpError

      return { success: true }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في إنشاء الحساب'
      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true

    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      user.value = null
      session.value = null
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تسجيل الخروج'
      error.value = errorMessage
    } finally {
      loading.value = false
    }
  }

  async function getCurrentUser() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser

      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
    } catch (err: unknown) {
      console.error('Error getting current user:', err)
    } finally {
      initialized.value = true
    }
  }

  // Initialize auth state
  supabase.auth.onAuthStateChange((event, authSession) => {
    user.value = authSession?.user ?? null
    session.value = authSession
    if (!initialized.value) {
      initialized.value = true
    }
  })

  return {
    user,
    session,
    loading,
    error,
    initialized,
    isAuthenticated,
    isTeacher,
    signIn,
    signUp,
    signOut,
    getCurrentUser
  }
})
