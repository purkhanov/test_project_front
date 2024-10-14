<template>
  <Toast />
  <ConfirmPopup />

  <div class="card flex justify-center" style="margin-bottom: 1rem;">
    <Button label="Add breed" @click="visible = true" />
    <Dialog v-model:visible="visible" header="Add breed" :style="{ width: '25rem' }">
      <div class="flex items-center gap-4 mb-4" style="margin-bottom: 1rem;">
        <InputText v-model="newBreed.breed_title" size="large" id="username" autocomplete="off" placeholder="Breed" style="width: 100%; margin-bottom: 1rem;" />
        <Select v-model="newBreed.animaltype_id" size="large" :options="animaltypes" optionLabel="animal_type" optionValue="id" placeholder="Select animal type" style="width: 100%;" />
      </div>
      <div class="flex justify-end gap-2" style="display: flex; justify-content: end; gap: 2rem;">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Add" @click="addBreed"></Button>
      </div>
    </Dialog>
  </div>

	<div class="card" style="font-size: 16px;">
		<DataTable v-model:editingRows="editingRows" :value="breeds" editMode="row" dataKey="id" @row-edit-save="onRowEditSave"
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

      <Column field="breed" header="Breed" style="width: 20%">
				<template #editor="{ data, field }">
					<InputText v-model="data[field]" fluid />
				</template>
			</Column>

      <Column field="animal_type" header="Animaltype" style="width: 20%">
				<template #editor="{ data, field }">
					<Select v-model="data[field]" :options="animaltypes" optionLabel="animal_type" optionValue="animal_type" :placeholder="data[field]" class="w-full md:w-56" />
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
import { ref, onMounted } from 'vue';
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Select from 'primevue/select';
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import axiosInstance from '@/plugins/axios';

const confirm = useConfirm()
const toast = useToast()

const visible = ref(false)
const breeds = ref([])
const editingRows = ref([])
const animaltypes = ref([])
const newBreed = ref({
  breed_title: '',
  animaltype_id: null
})

onMounted(onMountedFunc)

async function onMountedFunc() {
  try {
    const breedsRes = await axiosInstance.get('/breeds')
    const animalsRes = await axiosInstance.get('/animaltypes')
    if (animalsRes.status >=200 && animalsRes.status < 300 || breedsRes.status >=200 && breedsRes.status < 300) {
      breeds.value = breedsRes.data
      animaltypes.value = animalsRes.data
    }
  } catch(error) {
    console.log(error)
  }
}

function getAnimaltypeId(animaltype) {
  const r = animaltypes.value.filter(el => el.animal_type === animaltype)
  return r[0].id
}

async function onRowEditSave(event, data) {
  let { newData, index } = event
  const payload = {
    id: newData.id,
    breed_title: newData.breed,
    animaltype_id: getAnimaltypeId(newData.animal_type)
  }

  try {
    const res = await axiosInstance.put(`/breeds/${newData.id}`, {...payload})
    if (res.status >= 200 && res.status < 300) {
      onMountedFunc()
    }
  } catch(error) {
    console.log(error)
  }
}

async function addBreed() {
  const payload = {
    breed_title: newBreed.value.breed_title.trim(),
    animaltype_id: newBreed.value.animaltype_id
  }

  if (!payload.breed_title || !payload.animaltype_id) return

  try {
    const res = await axiosInstance.post('/breeds', {...payload})
    visible.value = false
    onMountedFunc()
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
        const res = await axiosInstance.delete(`/breeds/${data.id}`)
        if (res.status === 204) {
          breeds.value = breeds.value.filter(user => user.id !== data.id)
        }
      } catch(error) {
        console.log(error)
      }
    },
    reject: () => {}
  })
}

</script>
