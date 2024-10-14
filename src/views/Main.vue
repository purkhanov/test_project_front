<template>
  <div class="container">
    <Header />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()

onMounted(async () => {
  await profileStore.getUserProfile()
})
</script>

<style scoped>
.container {
  max-width: 1240px;
  margin: 0 auto;
}
</style>

