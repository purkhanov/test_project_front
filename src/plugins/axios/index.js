import axios from 'axios'
import { config } from '@/configs'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const axiosInstance = axios.create({baseURL: config.baseUrl})

axiosInstance.interceptors.request.use(config => {
  const authStore = useAuthStore()
  const token = authStore.tokenJWT

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 406) {
      const authStore = useAuthStore()
      authStore.logOut()
      router.push('/sign-in')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance