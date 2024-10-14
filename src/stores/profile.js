import { computed, ref } from "vue"
import { defineStore } from "pinia"
import axiosInstance from "@/plugins/axios"

export const useProfileStore = defineStore('profileStore', () => {
  const userProfile = ref({})

  const isAdmin = computed(() => userProfile.value.is_admin)

  async function getUserProfile() {
    try {
      const response = await axiosInstance.get('/users')

      if (response.status === 200) {
        userProfile.value = response.data
      }
    } catch(error) {
      console.log(error)
    }
  }

  return { userProfile, isAdmin, getUserProfile }
})
