<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { config } from '@/configs'

const authStore = useAuthStore()

onMounted(async () => {
  const token = JSON.parse(localStorage.getItem(config.localStorageTokenKey))
  if (token) authStore.tokenJWT = token
})
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5rem;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
}

h4 {
  margin: unset;
  padding: unset;
}
</style>

