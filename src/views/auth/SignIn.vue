<template>
  <main class="container">
    <Toast />
    <div class="content">
      <h4>Sign in</h4>

      <form class="form" action="#" >
        <InputText
          v-model="email"
          :class="['input', { 'invalid': isValidEmail || isEmpty }]"
          type="email"
          placeholder="Email..."
        />
  
        <InputText
          v-model="password"
          :class="['input', { 'invalid': isEmpty }]"
          type="password"
          placeholder="Password..."
        />
  
        <Button
          v-if="!authStore.loader"
          @click.prevent="signIn"
          label="Sign in"
          style="width: 90%;"
        />
        
        <div v-else class="card flex justify-center">
          <ProgressSpinner
            style="width: 30px;
            height: 30px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
          />
        </div>
      </form>
      <router-link to="sign-up" style="font-size: 16px;">Sign up</router-link>
    </div>
    
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { config } from '@/configs'
import { useToast } from "primevue/usetoast"
import Toast from 'primevue/toast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner';

const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')

const isEmpty = ref(false)
const isValidEmail = computed(() => !email.value.match(config.reEmail) && email.value)

async function signIn() {
  if (
    !email.value || 
    !password.value ||
    !email.value.match(config.reEmail)
  ) {
    isEmpty.value = true
    setTimeout(() => isEmpty.value = false, '1000')
    return
  }

  const payload = {
    email: email.value.trim(),
    password: password.value.trim()
  }

  const msg = await authStore.signIn(payload)
  if (msg) {
    toast.add({severity: 'error', summary: 'Error', detail: msg, life: 3000})
  }
}
</script>

<style scoped>
h4 {
  margin: 5px 0;
}
.content {
  text-align: center;
  max-width: 400px;
  margin: 120px auto;
  padding: 10px 0;
  border-radius: 5px;
  box-shadow: 0 0 2px #c5c5c5;
}

.form {
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.input {
  width: 90%;
  font-size: 13px;
}

.invalid {
  border-color: #f87171 !important;
}
</style>
