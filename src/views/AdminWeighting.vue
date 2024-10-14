<template>
  <Toast />
  <ConfirmPopup />

  <div class="card flex justify-center" style="margin-bottom: 1rem;">
    <Button label="Add weight" @click="visible = true" />
    <Dialog v-model:visible="visible" header="Add weight" :style="{ width: '25rem' }">
      <div class="flex items-center gap-4 mb-4" style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <InputNumber v-model="newWeighting.weight" inputId="locale-us" locale="en-US" :minFractionDigits="2" style="width: 50%;" fluid />
          <DatePicker v-model="newWeighting.weight_date" dateFormat="yy-mm-dd" />
        </div>
        <Select v-model="newWeighting.animal_id" size="large" :options="addWeightingSelect()" optionLabel="name" optionValue="value" placeholder="Select animal" />
        <Select v-model="newWeighting.weighted_user" :options="users" optionLabel="email" optionValue="id" placeholder="Select user" class="w-full md:w-56" />
      </div>
      <div class="flex justify-end gap-2" style="display: flex; justify-content: end; gap: 2rem;">
        <Button type="button" label="Cancel" severity="secondary" @click="closeModalForm"></Button>
        <Button type="button" label="Add" @click="addWeight"></Button>
      </div>
    </Dialog>
  </div>

	<div class="card" style="font-size: 16px;">
    <Toast />
    <ConfirmPopup></ConfirmPopup>
		<DataTable v-model:editingRows="editingRows" :value="weightings" editMode="row" dataKey="id" @row-edit-save="onRowEditSave"
			:pt="{
				table: { style: 'min-width: 50rem' },
				column: {
					bodycell: ({ state }) => ({
						style:  state['d_editing']&&'padding-top: 0.75rem; padding-bottom: 0.75rem'
					})
				}
			}"
		>
			<Column field="inventory_number" header="Inventory number" style="width: 15%" />
      
      <Column field="nickname" header="Nickname" style="width: 20%">
				<template #editor="{ data, field }">
					<Select v-model="data[field]" :options="addWeightingSelect()" optionLabel="name" optionValue="value" :placeholder="data[field]" class="w-full md:w-56" />
				</template>
			</Column>

			<Column field="animaltype" header="Animaltype" style="width: 15%" />

      <Column field="breed" header="Breed" style="width: 10%" />

			<Column field="gender" header="Gender" style="width: 5%">
        <template #body="slotProps">
          <Tag :value="slotProps.data.gender" :severity="getGenderLabelColor(slotProps.data.gender)" />
        </template>
			</Column>

      <Column field="weight" header="Weight" style="width: 15%">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" inputId="locale-us" locale="en-US" :minFractionDigits="2" fluid />
        </template>
      </Column>

			<Column field="weight_date" header="Weighted date" style="width: 20%" >
        <template #editor="{ data, field }">
          <DatePicker v-model="data[field]" dateFormat="yy-mm-dd" />
				</template>
      </Column>

      <Column field="weighted_user" header="Weighted user" style="width: 20%">
        <template #editor="{ data, field }">
					<Select v-model="data[field]" :options="users" optionLabel="email" optionValue="id" placeholder="Select user" class="w-full md:w-56" />
				</template>
      </Column>

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
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import ConfirmPopup from 'primevue/confirmpopup'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import axiosInstance from '@/plugins/axios'

const confirm = useConfirm()
const toast = useToast()

const visible = ref(false)
const weightings = ref([])
const editingRows = ref([])
const newWeighting = ref({})
const animals = ref([])
const users = ref([])


onMounted(onMountedFunc)

async function onMountedFunc() {
  try {
    const res = await axiosInstance.get('/admin/weightings')
    const animalRes = await axiosInstance.get('/admin/animals')
    const usersRes = await axiosInstance.get('/admin/users')

    if (res.status >=200 && res.status < 300) {
      weightings.value = res.data
      animals.value = animalRes.data
      users.value = usersRes.data
    }
  } catch(error) {
    console.log(error)
  }
}

function addWeightingSelect() {
  const res = animals.value.map(el => {
    return {
      name: `${el.nickname}, ${el.animaltype}, ${el.breed}`,
      value: el.id
    }
  })
  return res
}

async function addWeight() {
  const payload = newWeighting.value
  console.log(payload, 'pay ---')

  try {
    const res = await axiosInstance.post('/admin/weightings', {...payload})
    if (res.status === 201) {
      onMountedFunc()
      visible.value = false
      newWeighting.value = {}
    }
  } catch(error) {
    if (error.response.status === 400) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.detail, life: 5000 })
    }
  }
}

function closeModalForm() {
  visible.value = false
  newWeighting.value = {}
}

function getGenderLabelColor(status) {
	switch (status) {
		case 'male':
			return 'success';

		case 'female':
			return 'danger';

		default:
			return null;
	}
}

async function onRowEditSave(event, data) {
  let { newData, index } = event

  const payload = {
    animal_id: typeof newData.nickname === "number" ? newData.nickname : null,
    weight_date: newData.weight_date,
    weight: newData.weight,
    weighted_user: typeof newData.weighted_user === "number" ? newData.weighted_user : null
  }

  try {
    const res = await axiosInstance.put(`/admin/weightings/${newData.id}`, {...payload})
    if (res.status >= 200 && res.status < 300) {
      onMountedFunc()
    }
  } catch(error) {
    if (error.response.status === 400) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.detail, life: 5000 })
    }
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
        const res = await axiosInstance.delete(`/admin/weightings/${data.id}`)
        if (res.status === 204) {
          weightings.value = weightings.value.filter(user => user.id !== data.id)
        }
      } catch(error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.detail, life: 3000 })
        console.log(error)
      }
    },
    reject: () => {}
  })
}

</script>
