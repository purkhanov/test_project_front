<template>
  <Toast />
  <main class="container">
    <div class="content">
      <h4>Verify</h4>

      <p v-if="success" style="font-size: 14px;">Success</p>
      <p v-else style="font-size: 14px;">Error</p>

      <router-link v-if="success" to="/sign-in">Sign-in</router-link>
    </div>
  </main>
</template>
  
<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'
import { useRoute } from 'vue-router'
import { useToast } from "primevue/usetoast"
import Toast from 'primevue/toast'

const route = useRoute()
const toast = useToast()

const success = ref(false)

onMounted(async () => {
  try {
    const res = await axiosInstance.get(`/auth/verify/${route.params.email}/${route.params.code}`)
    if (res.status === 200) {
      success.value = true
    }
  } catch(error) {
    toast.add({severity: 'error', summary: 'Error', detail: error.response.data.detail, life: 3000})
  }
})
</script>
  
<style scoped>
h4 {
  margin: 5px 0;
}
.content {
  text-align: center;
  margin: 120px auto;
  padding: 10px 0;
  border-radius: 5px;
  box-shadow: 0 0 2px #c5c5c5;
}
</style>
  