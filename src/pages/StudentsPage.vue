<template>
  <q-page class="q-pa-md">
    <div class="students">
      <!-- Header -->
      <div class="students__header">
        <div class="row items-center justify-between">
          <div>
            <h1 class="students__title">{{ langStore.getText('students') }}</h1>
            <p class="students__subtitle">{{ langStore.getText('manageStudents') }}</p>
          </div>
          <q-btn
            color="primary"
            icon="add"
            :label="langStore.getText('addStudent')"
            @click="showAddDialog = true"
          />
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="students__filters q-mb-md">
        <div class="row q-gutter-md">
          <div class="col-md-4">
            <q-input
              v-model="searchQuery"
              :placeholder="langStore.getText('searchStudents')"
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-md-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              :label="langStore.getText('status')"
              outlined
              dense
              clearable
            />
          </div>
          <div class="col-md-3">
            <q-select
              v-model="educationFilter"
              :options="educationOptions"
              :label="langStore.getText('educationLevel')"
              outlined
              dense
              clearable
            />
          </div>
        </div>
      </div>

      <!-- Students Table -->
      <q-card class="students__table-card">
        <q-table
          :rows="filteredStudents"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          :loading="loading"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-dropdown flat round icon="more_vert" size="sm">
                <q-list>
                  <q-item clickable v-close-popup @click="viewStudent(props.row)">
                    <q-item-section avatar>
                      <q-icon name="visibility" />
                    </q-item-section>
                    <q-item-section>{{ langStore.getText('view') }}</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="editStudent(props.row)">
                    <q-item-section avatar>
                      <q-icon name="edit" />
                    </q-item-section>
                    <q-item-section>{{ langStore.getText('edit') }}</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="deleteStudent(props.row)">
                    <q-item-section avatar>
                      <q-icon name="delete" color="negative" />
                    </q-item-section>
                    <q-item-section class="text-negative">{{ langStore.getText('delete') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.row.status)"
                text-color="white"
                :label="getStatusText(props.row.status)"
                size="sm"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-registration_date="props">
            <q-td :props="props">
              {{ formatDate(props.row.registration_date) }}
            </q-td>
          </template>

          <template v-slot:body-cell-last_login="props">
            <q-td :props="props">
              {{ props.row.last_login ? formatDate(props.row.last_login) : langStore.getText('never') }}
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- Add Student Dialog -->
      <q-dialog v-model="showAddDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">{{ langStore.getText('addNewStudent') }}</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="addStudent" class="q-gutter-md">
              <q-input
                v-model="newStudent.name"
                :label="langStore.getText('name') + ' *'"
                outlined
                :rules="[val => !!val || langStore.getText('nameRequired')]"
              />

              <q-input
                v-model="newStudent.email"
                type="email"
                :label="langStore.getText('email') + ' *'"
                outlined
                :rules="[
                  val => !!val || langStore.getText('emailRequired'),
                  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || langStore.getText('invalidEmail')
                ]"
              />

              <q-input
                v-model="newStudent.phone"
                :label="langStore.getText('phone')"
                outlined
              />

              <q-select
                v-model="newStudent.education_level"
                :options="educationOptions"
                :label="langStore.getText('educationLevel')"
                outlined
              />

              <q-input
                v-model="newStudent.motivation"
                type="textarea"
                :label="langStore.getText('motivation')"
                outlined
                rows="3"
              />

              <q-select
                v-model="newStudent.status"
                :options="statusOptions"
                :label="langStore.getText('status')"
                outlined
              />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="langStore.getText('cancel')" color="primary" v-close-popup />
            <q-btn :label="langStore.getText('add')" color="primary" @click="addStudent" :loading="submitting" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- View Student Dialog -->
      <q-dialog v-model="showViewDialog">
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">{{ langStore.getText('studentDetails') }}</div>
          </q-card-section>

          <q-card-section v-if="selectedStudent">
            <div class="row q-gutter-md">
              <div class="col-12">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ langStore.getText('name') }}</q-item-label>
                    <q-item-label>{{ selectedStudent.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ langStore.getText('email') }}</q-item-label>
                    <q-item-label>{{ selectedStudent.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="selectedStudent.phone">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ langStore.getText('phone') }}</q-item-label>
                    <q-item-label>{{ selectedStudent.phone }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="selectedStudent.education_level">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ langStore.getText('educationLevel') }}</q-item-label>
                    <q-item-label>{{ selectedStudent.education_level }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="selectedStudent.motivation">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ langStore.getText('motivation') }}</q-item-label>
                    <q-item-label>{{ selectedStudent.motivation }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ langStore.getText('status') }}</q-item-label>
                    <q-chip
                      :color="getStatusColor(selectedStudent.status)"
                      text-color="white"
                      :label="getStatusText(selectedStudent.status)"
                    />
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ langStore.getText('registrationDate') }}</q-item-label>
                    <q-item-label>{{ formatDate(selectedStudent.registration_date) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="langStore.getText('close')" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'
import { DatabaseService, type Student } from '../lib/database'

const langStore = useLanguageStore()
const $q = useQuasar()

// Types
interface NewStudent {
  name: string
  email: string
  phone: string
  education_level: string
  motivation: string
  status: string
}

// Reactive data
const loading = ref(false)
const submitting = ref(false)
const students = ref<Student[]>([])
const showAddDialog = ref(false)
const showViewDialog = ref(false)
const selectedStudent = ref<Student | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const educationFilter = ref('')

const newStudent = ref<NewStudent>({
  name: '',
  email: '',
  phone: '',
  education_level: '',
  motivation: '',
  status: 'pending'
})

// Computed
const filteredStudents = computed(() => {
  let filtered = students.value

  if (searchQuery.value) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(student => student.status === statusFilter.value)
  }

  if (educationFilter.value) {
    filtered = filtered.filter(student => student.education_level === educationFilter.value)
  }

  return filtered
})

const statusOptions = [
  { label: 'نشط', value: 'active' },
  { label: 'غير نشط', value: 'inactive' },
  { label: 'في الانتظار', value: 'pending' },
  { label: 'معلق', value: 'suspended' }
]

const educationOptions = [
  { label: 'ابتدائي', value: 'primary' },
  { label: 'متوسط', value: 'middle' },
  { label: 'ثانوي', value: 'secondary' },
  { label: 'جامعي', value: 'university' },
  { label: 'خريج', value: 'graduate' }
]

const columns = [
  {
    name: 'name',
    label: langStore.getText('name'),
    field: 'name',
    align: 'right',
    sortable: true
  },
  {
    name: 'email',
    label: langStore.getText('email'),
    field: 'email',
    align: 'right',
    sortable: true
  },
  {
    name: 'status',
    label: langStore.getText('status'),
    field: 'status',
    align: 'center',
    sortable: true
  },
  {
    name: 'education_level',
    label: langStore.getText('educationLevel'),
    field: 'education_level',
    align: 'right',
    sortable: true
  },
  {
    name: 'registration_date',
    label: langStore.getText('registrationDate'),
    field: 'registration_date',
    align: 'center',
    sortable: true
  },
  {
    name: 'last_login',
    label: langStore.getText('lastLogin'),
    field: 'last_login',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: langStore.getText('actions'),
    field: 'actions',
    align: 'center'
  }
]

// Methods
function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'positive'
    case 'inactive': return 'negative'
    case 'pending': return 'warning'
    case 'suspended': return 'grey'
    default: return 'grey'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'active': return 'نشط'
    case 'inactive': return 'غير نشط'
    case 'pending': return 'في الانتظار'
    case 'suspended': return 'معلق'
    default: return status
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

async function loadStudents() {
  try {
    loading.value = true
    students.value = await DatabaseService.getStudents()
  } catch (error) {
    console.error('Error loading students:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorLoadingStudents') || 'حدث خطأ في تحميل الطلاب'
    })
  } finally {
    loading.value = false
  }
}

function viewStudent(student: Student) {
  selectedStudent.value = student
  showViewDialog.value = true
}

function editStudent(student: Student) {
  // TODO: Implement edit functionality
  $q.notify({
    type: 'info',
    message: `تعديل الطالب: ${student.name}`
  })
}

function deleteStudent(student: Student) {
  $q.dialog({
    title: langStore.getText('confirmDelete'),
    message: `${langStore.getText('deleteStudentConfirm')} ${student.name}؟`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await DatabaseService.deleteStudent(student.id)
        students.value = students.value.filter(s => s.id !== student.id)
        $q.notify({
          type: 'positive',
          message: langStore.getText('studentDeleted') || 'تم حذف الطالب بنجاح'
        })
      } catch (error) {
        console.error('Error deleting student:', error)
        $q.notify({
          type: 'negative',
          message: langStore.getText('errorDeletingStudent') || 'حدث خطأ في حذف الطالب'
        })
      }
    })()
  })
}

async function addStudent() {
  if (!newStudent.value.name || !newStudent.value.email) {
    return
  }

  try {
    submitting.value = true
    const student = await DatabaseService.createStudent({
      name: newStudent.value.name,
      email: newStudent.value.email,
      phone: newStudent.value.phone || null,
      education_level: newStudent.value.education_level || null,
      motivation: newStudent.value.motivation || null,
      status: newStudent.value.status as 'pending' | 'active' | 'inactive' | 'suspended'
    })

    students.value.unshift(student)
    showAddDialog.value = false
    newStudent.value = {
      name: '',
      email: '',
      phone: '',
      education_level: '',
      motivation: '',
      status: 'pending'
    }

    $q.notify({
      type: 'positive',
      message: langStore.getText('studentAdded') || 'تم إضافة الطالب بنجاح'
    })
  } catch (error) {
    console.error('Error adding student:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorAddingStudent') || 'حدث خطأ في إضافة الطالب'
    })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadStudents()
})
</script>

<style lang="scss" scoped>
.students {
  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $dark;
    margin: 0 0 0.5rem 0;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: #64748b;
    margin: 0;
  }

  &__filters {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &__table-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }
}
</style>
