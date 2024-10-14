<template>
  <div class="container">
    <div style="display: flex; gap: 2rem; justify-content: center; margin-top: 50px;">
      <router-link v-if="!authStore.tokenJWT" to="sign-up">sign-up</router-link>
      <router-link v-if="!authStore.tokenJWT" to="sign-in">sign-in</router-link>
      <router-link v-if="authStore.tokenJWT" to="sign-in">log-out</router-link>
    </div>

    <h2 style="text-align: center; margin-top: 50px;">Welcome to the test project</h2>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
</script>

<style scoped>
.container {
  max-width: 1240px;
  margin: 0 auto;
}
</style>

