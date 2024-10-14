<template>
	<div class="card" style="font-size: 16px;">
    <Toast />
    <ConfirmPopup></ConfirmPopup>
		<DataTable v-model:editingRows="editingRows" :value="users" editMode="row" dataKey="id" @row-edit-save="onRowEditSave"
			:pt="{
				table: { style: 'min-width: 50rem' },
				column: {
					bodycell: ({ state }) => ({
						style:  state['d_editing']&&'padding-top: 0.75rem; padding-bottom: 0.75rem'
					})
				}
			}"
		>
			<Column field="id" header="ID" style="width: 5%" />
			<Column field="first_name" header="Name" style="width: 20%">
				<template #editor="{ data, field }">
					<InputText v-model="data[field]" fluid />
				</template>
			</Column>

			<Column field="email" header="Email" style="width: 20%">
				<template #editor="{ data, field }">
					<InputText v-model="data[field]" fluid />
				</template>
			</Column>

			<Column field="is_admin" header="Role" style="width: 10%">
				<template #body="slotProps">
					<Tag :value="getRole(slotProps.data.is_admin)" severity="success" />
				</template>
			</Column>

			<Column field="is_active" header="Active" style="width: 10%">
				<template #body="slotProps">
					<Tag value="Active" :severity="getStatusLabel(slotProps.data.is_active)" />
				</template>
			</Column>

			<Column field="created_at" header="Created at" style="width: 20%" />

      <Column :rowEditor="true" style="width: 5%; min-width: 8rem" bodyStyle="text-align:center"></Column>

      <Column style="width:5%; min-width: 8rem" bodyStyle="text-align:center">
        <template #body="{ data }">
          <Button icon="pi pi-search" @click="deleteConfirm($event, data)" severity="secondary" rounded>X</Button>
        </template>
      </Column>
		</DataTable>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import Select from 'primevue/select';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import axiosInstance from '@/plugins/axios';

const confirm = useConfirm()
const toast = useToast()

const users = ref([])
const editingRows = ref([])
const statuses = ref([
	{ label: 'Admin', value: true },
	{ label: 'User', value: false },
])

const activeStatuses = ref([
	{ label: 'On', value: true },
	{ label: 'Off', value: false },
])

onMounted(async () => {
  const res = await axiosInstance.get('/users')
  users.value.push(res.data)
})

function getRole(status) {
	switch (status) {
		case true:
			return 'Admin';

		case false:
			return 'User';
	}
}

function getActive(status) {
	switch (status) {
		case true:
			return 'On';

		case false:
			return 'Off';
	}
}

function getStatusLabel(status) {
	switch (status) {
		case true:
			return 'success';

		case false:
			return 'danger';

		default:
			return null;
	}
}

async function onRowEditSave(event, data) {
	let { newData, index } = event

  try {
    const res = await axiosInstance.put(`/users`, {...newData})
    if (res.status >= 200 && res.status < 300) {
      users.value[index] = newData
    }
  } catch(error) {
    console.log(error)
  }
}

function deleteConfirm(event, data) {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this record?',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Deleted', life: 3000 })
      try {
        const res = await axiosInstance.delete(`/users`)
        if (res.status === 204) {
          users.value = users.value.filter(user => user.id !== data.id)
        }
      } catch(error) {
        console.log(error)
      }
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
    }
  })
}

</script>
