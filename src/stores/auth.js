import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import axiosInstance from '@/plugins/axios'
import { config } from '@/configs'


export const useAuthStore = defineStore('authStore', () => {
  const loader = ref(false)
  const tokenJWT = ref('')
  const createdData = ref(null)

  async function signUp(payload) {
    loader.value = true

    try {
      const response = await axiosInstance.post('/auth/sign-up', {...payload})

      if (response.status === 201) {
        createdData.value = response.data
        return {
          severity: 'success',
          msg: response.data.message
        }
      }
      
    } catch(error) {
      return {
        severity: 'error',
        msg: error.response.data.detail
      }
    } finally {
      loader.value = false
    }
  }

  async function signIn(payload) {
    loader.value = true

    const formData = new FormData()
    formData.append('username', payload.email)
    formData.append('password', payload.password)

    try {
      const response = await axiosInstance({
        method: 'post',
        url: '/auth/token',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data'},
      })

      if (response.status === 200) {
        router.push('/animals')
        tokenJWT.value = response.data.access_token
        localStorage.setItem(config.localStorageTokenKey, JSON.stringify(tokenJWT.value))
      }
    } catch(error) {
      return error.response.data.detail
    } finally {
      loader.value =false
    }
  }

  function logOut() {
    localStorage.removeItem(config.localStorageTokenKey)
    tokenJWT.value = ''
  }

  return { loader, createdData, signUp, signIn, logOut }
})