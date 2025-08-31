<template>
  <q-page class="q-pa-md">
    <div class="pending-students">
      <!-- Header -->
      <div class="pending-students__header">
        <div class="row items-center justify-between">
          <div>
            <h1 class="pending-students__title">{{ langStore.getText('pendingStudents') }}</h1>
            <p class="pending-students__subtitle">{{ langStore.getText('reviewRegistrationRequests') }}</p>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              color="positive"
              icon="check_circle"
              :label="langStore.getText('approveAll')"
              @click="approveAllSelected"
              :disabled="selectedStudents.length === 0"
            />
            <q-btn
              color="negative"
              icon="cancel"
              :label="langStore.getText('rejectAll')"
              @click="rejectAllSelected"
              :disabled="selectedStudents.length === 0"
            />
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="pending-students__stats q-mb-lg">
        <div class="row q-gutter-md">
          <div class="col-md-3">
            <q-card class="pending-students__stat-card">
              <q-card-section class="text-center">
                <q-icon name="pending" size="3rem" color="warning" />
                <div class="text-h4 q-mt-sm">{{ pendingStudents.length }}</div>
                <div class="text-subtitle2">{{ langStore.getText('pendingRequests') }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3">
            <q-card class="pending-students__stat-card">
              <q-card-section class="text-center">
                <q-icon name="check_circle" size="3rem" color="positive" />
                <div class="text-h4 q-mt-sm">{{ approvedCount }}</div>
                <div class="text-subtitle2">{{ langStore.getText('approvedToday') }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3">
            <q-card class="pending-students__stat-card">
              <q-card-section class="text-center">
                <q-icon name="cancel" size="3rem" color="negative" />
                <div class="text-h4 q-mt-sm">{{ rejectedCount }}</div>
                <div class="text-subtitle2">{{ langStore.getText('rejectedToday') }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3">
            <q-card class="pending-students__stat-card">
              <q-card-section class="text-center">
                <q-icon name="schedule" size="3rem" color="info" />
                <div class="text-h4 q-mt-sm">{{ averageResponseTime }}</div>
                <div class="text-subtitle2">{{ langStore.getText('avgResponseTime') }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Pending Students Table -->
      <q-card class="pending-students__table-card">
        <q-table
          :rows="pendingStudents"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          :loading="loading"
          v-model:selected="selectedStudents"
          selection="multiple"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="row q-gutter-sm">
                <q-btn
                  flat
                  round
                  icon="visibility"
                  size="sm"
                  color="info"
                  @click="viewStudent(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="check_circle"
                  size="sm"
                  color="positive"
                  @click="approveStudent(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="cancel"
                  size="sm"
                  color="negative"
                  @click="rejectStudent(props.row)"
                />
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-request_date="props">
            <q-td :props="props">
              {{ formatDate(props.row.registration_date) }}
            </q-td>
          </template>

          <template v-slot:body-cell-education_level="props">
            <q-td :props="props">
              {{ props.row.education_level || langStore.getText('notSpecified') }}
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- View Student Dialog -->
      <q-dialog v-model="showViewDialog" maximized>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ langStore.getText('studentDetails') }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section v-if="selectedStudent">
            <div class="row q-gutter-lg">
              <div class="col-12 col-md-6">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('name') }}</q-item-label>
                      <q-item-label class="text-h6">{{ selectedStudent.name }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('email') }}</q-item-label>
                      <q-item-label>{{ selectedStudent.email }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="selectedStudent.phone">
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('phone') }}</q-item-label>
                      <q-item-label>{{ selectedStudent.phone }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="selectedStudent.education_level">
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('educationLevel') }}</q-item-label>
                      <q-item-label>{{ selectedStudent.education_level }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('registrationDate') }}</q-item-label>
                      <q-item-label>{{ formatDate(selectedStudent.registration_date) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6">{{ langStore.getText('motivation') }}</div>
                    <p class="q-mt-md">{{ selectedStudent.motivation || langStore.getText('noMotivationProvided') }}</p>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              :label="langStore.getText('reject')"
              color="negative"
              icon="cancel"
              @click="rejectStudent(selectedStudent!)"
              v-close-popup
            />
            <q-btn
              :label="langStore.getText('approve')"
              color="positive"
              icon="check_circle"
              @click="approveStudent(selectedStudent!)"
              v-close-popup
            />
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

// Reactive data
const loading = ref(false)
const pendingStudents = ref<Student[]>([])
const selectedStudents = ref<Student[]>([])
const showViewDialog = ref(false)
const selectedStudent = ref<Student | null>(null)

// Computed
const approvedCount = computed(() => {
  // This would be calculated from activity log in a real implementation
  return 12
})

const rejectedCount = computed(() => {
  // This would be calculated from activity log in a real implementation
  return 3
})

const averageResponseTime = computed(() => {
  // This would be calculated from activity log in a real implementation
  return '2.5 ساعة'
})

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
    name: 'phone',
    label: langStore.getText('phone'),
    field: 'phone',
    align: 'right',
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
    name: 'actions',
    label: langStore.getText('actions'),
    field: 'actions',
    align: 'center'
  }
]

// Methods
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

async function loadPendingStudents() {
  try {
    loading.value = true
    pendingStudents.value = await DatabaseService.getPendingStudents()
  } catch (error) {
    console.error('Error loading pending students:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorLoadingPendingStudents') || 'حدث خطأ في تحميل الطلاب المعلقين'
    })
  } finally {
    loading.value = false
  }
}

function viewStudent(student: Student) {
  selectedStudent.value = student
  showViewDialog.value = true
}

async function approveStudent(student: Student) {
  try {
    await DatabaseService.approveStudent(student.id)

    // Remove from pending list
    pendingStudents.value = pendingStudents.value.filter(s => s.id !== student.id)
    selectedStudents.value = selectedStudents.value.filter(s => s.id !== student.id)

    // Log activity
    await DatabaseService.logActivity({
      action_type: 'student_approved',
      description: `تم الموافقة على طلب الطالب: ${student.name}`,
      related_entity_type: 'student',
      related_entity_id: student.id
    })

    $q.notify({
      type: 'positive',
      message: langStore.getText('studentApproved') || 'تم الموافقة على الطالب بنجاح'
    })
  } catch (error) {
    console.error('Error approving student:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorApprovingStudent') || 'حدث خطأ في الموافقة على الطالب'
    })
  }
}

function rejectStudent(student: Student) {
  $q.dialog({
    title: langStore.getText('confirmReject'),
    message: `${langStore.getText('rejectStudentConfirm')} ${student.name}؟`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await DatabaseService.rejectStudent(student.id)

        // Remove from pending list
        pendingStudents.value = pendingStudents.value.filter(s => s.id !== student.id)
        selectedStudents.value = selectedStudents.value.filter(s => s.id !== student.id)

        // Log activity
        await DatabaseService.logActivity({
          action_type: 'student_rejected',
          description: `تم رفض طلب الطالب: ${student.name}`,
          related_entity_type: 'student',
          related_entity_id: student.id
        })

        $q.notify({
          type: 'positive',
          message: langStore.getText('studentRejected') || 'تم رفض الطالب بنجاح'
        })
      } catch (error) {
        console.error('Error rejecting student:', error)
        $q.notify({
          type: 'negative',
          message: langStore.getText('errorRejectingStudent') || 'حدث خطأ في رفض الطالب'
        })
      }
    })()
  })
}

function approveAllSelected() {
  if (selectedStudents.value.length === 0) return

  $q.dialog({
    title: langStore.getText('confirmApproveAll'),
    message: `${langStore.getText('approveAllStudentsConfirm')} ${selectedStudents.value.length} ${langStore.getText('students')}؟`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        const promises = selectedStudents.value.map(student => approveStudent(student))
        await Promise.all(promises)

        $q.notify({
          type: 'positive',
          message: langStore.getText('allStudentsApproved') || 'تم الموافقة على جميع الطلاب المحددين'
        })
      } catch (error) {
        console.error('Error approving all students:', error)
        $q.notify({
          type: 'negative',
          message: langStore.getText('errorApprovingAllStudents') || 'حدث خطأ في الموافقة على الطلاب'
        })
      }
    })()
  })
}

function rejectAllSelected() {
  if (selectedStudents.value.length === 0) return

  $q.dialog({
    title: langStore.getText('confirmRejectAll'),
    message: `${langStore.getText('rejectAllStudentsConfirm')} ${selectedStudents.value.length} ${langStore.getText('students')}؟`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        const promises = selectedStudents.value.map(student => rejectStudent(student))
        await Promise.all(promises)

        $q.notify({
          type: 'positive',
          message: langStore.getText('allStudentsRejected') || 'تم رفض جميع الطلاب المحددين'
        })
      } catch (error) {
        console.error('Error rejecting all students:', error)
        $q.notify({
          type: 'negative',
          message: langStore.getText('errorRejectingAllStudents') || 'حدث خطأ في رفض الطلاب'
        })
      }
    })()
  })
}

onMounted(async () => {
  await loadPendingStudents()
})
</script>

<style lang="scss" scoped>
.pending-students {
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

  &__stats {
    margin-bottom: 2rem;
  }

  &__stat-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  }

  &__table-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }
}
</style>
