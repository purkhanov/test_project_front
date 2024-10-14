<template>
  <div class="card flex justify-center" style="margin-bottom: 1rem;">
    <Button label="Add" @click="visible = true" />
    <Dialog v-model:visible="visible" header="Add" :style="{ width: '25rem' }">
      <div class="flex items-center gap-4 mb-4" style="margin-bottom: 1rem;">
        <InputText v-model="newAnimaltype" size="large" id="username" class="flex-auto" autocomplete="off" placeholder="Animal type" />
      </div>
      <div class="flex justify-end gap-2" style="display: flex; justify-content: end; gap: 2rem;">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Add" @click="addAnimaltype"></Button>
      </div>
    </Dialog>
  </div>

	<div class="card" style="font-size: 16px;">
    <Toast />
    <ConfirmPopup></ConfirmPopup>
		<DataTable v-model:editingRows="editingRows" :value="animaltypes" editMode="row" dataKey="id" @row-edit-save="onRowEditSave"
			:pt="{
				table: { style: 'min-width: 50rem' },
				column: {
					bodycell: ({ state }) => ({
						style:  state['d_editing']&&'padding-top: 0.75rem; padding-bottom: 0.75rem'
					})
				}
			}"
		>
			<!-- <Column field="id" header="ID" style="width: 5%" /> -->

			<Column field="animal_type" header="Animaltype" style="width: 15%">
				<template #editor="{ data, field }">
					<InputText v-model="data[field]" fluid />
				</template>
			</Column>

      <Column field="created_at" header="Created at" style="width: 20%" />

      <Column :rowEditor="true" style="width: 5%; min-width: 8rem" bodyStyle="text-align:center"></Column>

      <Column style="width: 5%; min-width: 3rem" bodyStyle="text-align:center">
        <template #body="{ data }">
          <Button icon="pi pi-search" @click="deleteConfirm($event, data)" severity="secondary" rounded>X</Button>
        </template>
      </Column>
		</DataTable>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import axiosInstance from '@/plugins/axios'

const confirm = useConfirm()
const toast = useToast()

const newAnimaltype = ref('')
const visible = ref(false)
const animaltypes = ref([])
const editingRows = ref([])


onMounted(onMountedFunc)

async function onMountedFunc() {
  try {
    const res = await axiosInstance.get('/animaltypes')
    if (res.status >=200 && res.status < 300) {
      animaltypes.value = res.data
    }
  } catch(error) {
    console.log(error)
  }
}

async function addAnimaltype() {
  const animaltype = newAnimaltype.value.trim()
  if (!animaltype) {
    return
  }

  try {
    const res = await axiosInstance.post(`/animaltypes`, {animal_type: animaltype})
    if (res.status >= 200 && res.status < 300) {
      onMountedFunc()
    }
  } catch(error) {
    console.log(error)
  }

  visible.value = false
}

async function onRowEditSave(event, data) {
  let { newData, index } = event

  try {
    const res = await axiosInstance.put(`/animaltypes/${newData.id}`, {...newData})
    if (res.status >= 200 && res.status < 300) {
      animaltypes.value[index] = newData
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
      try {
        const res = await axiosInstance.delete(`/animaltypes/${data.id}`)
        if (res.status === 204) {
          animaltypes.value = animaltypes.value.filter(user => user.id !== data.id)
          toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Deleted', life: 3000 })
        }
      } catch(error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Can not delete retry', life: 3000 })
      }
    },
    reject: () => {}
  })
}
</script>
