import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pb } from '@/lib/pocketbase'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(pb.authStore.isValid)
  const user = ref(pb.authStore.model)

  // 监听 PB 的 Auth 状态变化
  pb.authStore.onChange((token, model) => {
    isLoggedIn.value = pb.authStore.isValid
    user.value = model
  })

  async function login(username: string, password: string) {
    try {
      await pb.collection('users').authWithPassword(username, password)
      return { success: true }
    } catch (error: any) {
      console.error('Login failed:', error)
      return { success: false, message: error.message }
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      const data = {
        username,
        email,
        password,
        passwordConfirm: password,
        name: username,
      }
      await pb.collection('users').create(data)
      return { success: true }
    } catch (error: any) {
      console.error('Register failed:', error)
      console.error('Validation errors:', error.data)
      return { success: false, message: error.message }
    }
  }

  function logout() {
    pb.authStore.clear()
  }

  return { isLoggedIn, user, login, logout, register }
})
