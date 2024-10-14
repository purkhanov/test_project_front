<template>
  <Toast />
  <ConfirmPopup />

  <div class="card flex justify-center" style="margin-bottom: 1rem;">
    <Button label="Add animal" @click="visible = true" />
    <Dialog v-model:visible="visible" header="Add animal" :style="{ width: '25rem' }">
      <div class="flex items-center gap-4 mb-4" style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 1rem;">
        <InputText v-model="newAnimal.inventory_number" size="large" autocomplete="off" placeholder="Inventory number" />

        <InputText v-model="newAnimal.nickname" size="large" autocomplete="off" placeholder="Nickname" />

        <DatePicker v-model="newAnimal.arrival_date" date-format="dd-mm-yy" placeholder="Arrival date" />

        <InputNumber v-model="newAnimal.arrival_age" inputId="locale-us" locale="en-US" placeholder="Arrival age in manth" fluid />

        <Select v-model="newAnimal.gender" size="large" :options="genders" optionLabel="label" optionValue="value" placeholder="Gender" />

        <Select v-model="updateAnimalType" size="large" :options="animalTypes" optionLabel="animal_type" optionValue="id" placeholder="Animal type" />

        <Select v-model="newAnimal.breed_id" size="large" :options="getBreedTypes()" optionLabel="breed" optionValue="id" placeholder="Breed" />

        <Select v-model="newAnimal.parent_id" size="large" :options="getAnimalParents()" optionLabel="nickname" optionValue="id" placeholder="Breed" />

      </div>
      <div class="flex justify-end gap-2" style="display: flex; justify-content: end; gap: 2rem;">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Add" @click="addAnimal"></Button>
      </div>
    </Dialog>
  </div>

	<div class="card" style="font-size: 16px;">
    <Toast />
    <ConfirmPopup></ConfirmPopup>
		<DataTable v-model:editingRows="editingRows" :value="animals" editMode="row" dataKey="id" @row-edit-save="onRowEditSave"
			:pt="{
				table: { style: 'min-width: 50rem' },
				column: {
					bodycell: ({ state }) => ({
						style:  state['d_editing']&&'padding-top: 0.75rem; padding-bottom: 0.75rem'
					})
				}
			}"
		>
			<Column field="inventory_number" header="Inventory number" style="width: 15%">
				<template #editor="{ data, field }">
					<InputText v-model="data[field]" fluid />
				</template>
			</Column>

      <Column field="nickname" header="Nickname" style="width: 15%">
				<template #editor="{ data, field }">
					<InputText v-model="data[field]" fluid />
				</template>
			</Column>

			<Column field="animaltype" header="Animaltype" style="width: 15%">
				<template #editor="{ data, field }">
					<Select v-model="updateAnimalType" :options="animalTypes" optionLabel="animal_type" optionValue="id" :placeholder="data[field]" class="w-full md:w-56" />
				</template>
			</Column>

      <Column field="breed" header="Breed" style="width: 10%">
				<template #editor="{ data, field }">
					<Select v-model="data[field]" :options="getBreedTypes()" optionLabel="breed" optionValue="id" placeholder="Breed" class="w-full md:w-56" />
				</template>
			</Column>

			<Column field="gender" header="Gender" style="width: 10%">
				<template #editor="{ data, field }">
					<Select v-model="data[field]" :options="genders" optionLabel="label" optionValue="value" placeholder="Select a Status" fluid>
						<template #option="slotProps">
							<Tag :value="slotProps.option.value" :severity="getGenderLabelColor(slotProps.option.value)" />
						</template>
					</Select>
				</template>
				<template #body="slotProps">
					<Tag :value="slotProps.data.gender" :severity="getGenderLabelColor(slotProps.data.gender)" />
				</template>
			</Column>

      <Column field="parent_nickname" header="Parent" style="width: 10%">
				<template #editor="{ data, field }">
					<Select v-model="data[field]" :options="getAnimalParents()" optionLabel="nickname" optionValue="id" placeholder="Breed" class="w-full md:w-56" />
				</template>
			</Column>

      <Column field="arrival_age" header="Arrival age" style="width: 15%">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" inputId="locale-us" locale="en-US" fluid />
        </template>
        <template #body="slotProps">
					<div>{{ slotProps.data.arrival_age }} month</div>
				</template>
      </Column>

			<Column field="arrival_date" header="Arrival date" style="width: 20%" >
        <template #editor="{ data, field }">
          <DatePicker v-model="data[field]" date-format="dd-mm-yy" />
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
import { ref, onMounted, computed } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import DatePicker from 'primevue/datepicker'
import ConfirmPopup from 'primevue/confirmpopup'
import InputNumber from 'primevue/inputnumber'
import Dialog from 'primevue/dialog'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import axiosInstance from '@/plugins/axios'

const confirm = useConfirm()
const toast = useToast()

const visible = ref(false)
const animals = ref([])
const animalTypes = ref([])
const editingRows = ref([])
const updateAnimalType = ref(null)
const genders = ref([
	{ label: 'male', value: 'male' },
	{ label: 'female', value: 'female' },
])

const breeds = ref([])
const newAnimal = ref({
  inventory_number: '',
  gender: '',
  nickname: '',
  arrival_date: null,
  arrival_age: null,
  breed_id: null,
  parent_id: null
})

onMounted(onMountedFunc)

async function onMountedFunc() {
  try {
    const res = await axiosInstance.get('/animals')
    const resAnimalTypes = await axiosInstance.get('/animaltypes')
    const resBreeds = await axiosInstance.get('/breeds')

    breeds.value = resBreeds.data
    animalTypes.value = resAnimalTypes.data

    if (res.status >=200 && res.status < 300) {
      animals.value = res.data
    }
  } catch(error) {
    console.log(error)
  }
}

function getBreedTypes() {
  return breeds.value.filter(el => el.animaltype_id === updateAnimalType.value)
}

function getAnimalParents() {
  const animal = animals.value.filter(el => el.id === updateAnimalType.value)
  let animalType
  if (animal[0]) {
    animalType = animal[0].animaltype
    return animals.value.filter(el => el.animaltype === animalType)
  }
  return animal
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

async function addAnimal() {
  const payload = newAnimal.value
  console.log(payload, 'value')
  try {
    const res = await axiosInstance.post('/animals', {...payload})
    if (res.status === 201) {
      onMountedFunc()
      visible.value = false
      newAnimal.value ={}
    }
  } catch(error) {
    if (error.response.status === 400) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.detail, life: 5000 })
    }
  }
}

async function onRowEditSave(event, data) {
  let { newData, index } = event

  const newDate = () => {
    try {
      return newData.arrival_date.toISOString().split('T')[0]
    } catch {
      return null
    }
  }

  const payload = {
    inventory_number: newData.inventory_number.trim(),
    gender: newData.gender,
    nickname: newData.nickname.trim(),
    arrival_date: newDate(),
    arrival_age: newData.arrival_age,
    breed_id: typeof newData.breed === "number" ? newData.breed : null
  }
  
  try {
    const res = await axiosInstance.put(`/animals/${newData.id}`, {...payload})
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
        const res = await axiosInstance.delete(`/animals/${data.id}`)
        if (res.status === 204) {
          animals.value = animals.value.filter(user => user.id !== data.id)
        }
      } catch(error) {
        console.log(error)
      }
    },
    reject: () => {}
  })
}

</script>
