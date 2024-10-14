<template>
  <main class="container">
    <Toast />

    <div class="content">
      <h4>Sign up</h4>

      <form class="form" action="#" >
        <InputText v-model="firstName" class="input" type="text" placeholder="Name..." />
        <InputText v-model="email" :class="['input', { 'invalid': isValidEmail || isEmpty }]" type="email" placeholder="Email..." />
        <InputText v-model="password" :class="['input', { 'invalid': isValidPassw || isEmpty }]" type="password" placeholder="Password..." />
        <Button v-if="!authStore.loader" @click.prevent="signUp" label="Sign up" style="width: 90%;" />
        <div v-else class="card flex justify-center">
          <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="8" fill="transparent" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
        </div>
      </form>
      <router-link to="sign-in" style="font-size: 16px;">Sign in</router-link>
    </div>
    
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { config } from '@/configs'
import { useToast } from "primevue/usetoast"
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner';


const authStore = useAuthStore()
const toast = useToast()

const firstName = ref('')
const email = ref('')
const password = ref('')

const isEmpty = ref(false)
const isValidEmail = computed(() => !email.value.match(config.reEmail) && email.value)
const isValidPassw = computed(() => !password.value.match(config.rePassw) && password.value)

async function signUp() {
  if (
    !email.value || 
    !password.value ||
    !email.value.match(config.reEmail) ||
    !password.value.match(config.rePassw)
  ) {
    toast.add({severity: 'warn', summary: 'Empty fields', detail: 'Empty fields', life: 3000})
    return
  }

  const payload = {
    first_name: firstName.value.trim() || null,
    email: email.value.trim(),
    password: password.value.trim()
  }

  const msg = await authStore.signUp(payload)
  if (msg) {
    toast.add({severity: msg.severity, summary: msg.severity, detail: msg.msg, life: 5000})
    console.log(msg.msg)
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
