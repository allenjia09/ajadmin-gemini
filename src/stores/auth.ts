import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const user = ref({ name: '', role: '' })

  function login(username: string) {
    isLoggedIn.value = true
    user.value = {
      name: username,
      role: 'admin',
    }
  }

  function logout() {
    isLoggedIn.value = false
    user.value = { name: '', role: '' }
  }

  return { isLoggedIn, user, login, logout }
})
