<template>
	<div class="card header">
		<Menubar :model="items">
			<template #item="{ item, props}">
				<a v-ripple class="flex items-center" v-bind="props.action">
					<span :class="item.icon"></span>
					<span class="ml-2">{{ item.label }}</span>
				</a>
			</template>
			<template #end>
				<div class="user_log-out flex items-center gap-2">

          <router-link v-if="profileStore.isAdmin" to="/admin/weightings">all weightings</router-link>
          <router-link v-if="profileStore.isAdmin" to="/admin/users">users</router-link>

					<router-link to="profile">profile</router-link>
					<a @click="logOut" class="flex items-center">log-out</a>
				</div>
			</template>
		</Menubar>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import Menubar from "primevue/menubar"
import router from "@/router"
import { useProfileStore } from "@/stores/profile";

const authStore = useAuthStore()
const profileStore = useProfileStore()


const items = ref([
  {
    label: 'Animals',
		command: () => router.push('/animals')
  },
  {
    label: 'Animal types',
		command: () => router.push('/animaltypes')
  },
  {
    label: 'Breeds',
		command: () => router.push('/breeds')
  },
  {
    label: 'Weightings',
    command: () => router.push('/weightings')
  }
])

function logOut() {
	authStore.logOut()
	router.push('/sign-in')
}
</script>

<style scoped>
.header {
	margin-top: 15px;
	margin-bottom: 50px;
}

.user_log-out {
	display: flex;
	align-items: center;
	font-size: 16px;
	gap: 25px;
	margin-right: 10px;
}

.user_log-out a {
	cursor: pointer;
}

.user_log-out a:hover {
	color: blue;
}
</style>
