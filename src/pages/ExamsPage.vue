<template>
  <q-page class="q-pa-md">
    <div class="exams">
      <!-- Header -->
      <div class="exams__header">
        <div class="row items-center justify-between">
          <div>
            <h1 class="exams__title">{{ langStore.getText('exams') }}</h1>
            <p class="exams__subtitle">{{ langStore.getText('manageExams') }}</p>
          </div>
          <q-btn
            color="primary"
            icon="add"
            :label="langStore.getText('createExam')"
            @click="$router.push('/exams/create')"
          />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="exams__stats q-mb-lg">
        <div class="row q-gutter-md">
          <div class="col-md-3">
            <q-card class="exams__stat-card">
              <q-card-section class="text-center">
                <q-icon name="quiz" size="3rem" color="primary" />
                <div class="text-h4 q-mt-sm">{{ exams.length }}</div>
                <div class="text-subtitle2">{{ langStore.getText('totalExams') }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3">
            <q-card class="exams__stat-card">
              <q-card-section class="text-center">
                <q-icon name="schedule" size="3rem" color="warning" />
                <div class="text-h4 q-mt-sm">{{ activeExamsCount }}</div>
                <div class="text-subtitle2">{{ langStore.getText('activeExams') }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3">
            <q-card class="exams__stat-card">
              <q-card-section class="text-center">
                <q-icon name="check_circle" size="3rem" color="positive" />
                <div class="text-h4 q-mt-sm">{{ completedExamsCount }}</div>
                <div class="text-subtitle2">{{ langStore.getText('completedExams') }}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-md-3">
            <q-card class="exams__stat-card">
              <q-card-section class="text-center">
                <q-icon name="analytics" size="3rem" color="info" />
                <div class="text-h4 q-mt-sm">{{ averageScore }}%</div>
                <div class="text-subtitle2">{{ langStore.getText('averageScore') }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="exams__filters q-mb-md">
        <div class="row q-gutter-md">
          <div class="col-md-4">
            <q-input
              v-model="searchQuery"
              :placeholder="langStore.getText('searchExams')"
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
              v-model="difficultyFilter"
              :options="difficultyOptions"
              :label="langStore.getText('difficulty')"
              outlined
              dense
              clearable
            />
          </div>
        </div>
      </div>

      <!-- Exams Table -->
      <q-card class="exams__table-card">
        <q-table
          :rows="filteredExams"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          :loading="loading"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-dropdown flat round icon="more_vert" size="sm">
                <q-list>
                  <q-item clickable v-close-popup @click="viewExam(props.row)">
                    <q-item-section avatar>
                      <q-icon name="visibility" />
                    </q-item-section>
                    <q-item-section>{{ langStore.getText('view') }}</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="editExam(props.row)">
                    <q-item-section avatar>
                      <q-icon name="edit" />
                    </q-item-section>
                    <q-item-section>{{ langStore.getText('edit') }}</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="viewResults(props.row)">
                    <q-item-section avatar>
                      <q-icon name="analytics" />
                    </q-item-section>
                    <q-item-section>{{ langStore.getText('results') }}</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable v-close-popup @click="deleteExam(props.row)">
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

          <template v-slot:body-cell-difficulty="props">
            <q-td :props="props">
              <q-chip
                :color="getDifficultyColor(props.row.difficulty)"
                text-color="white"
                :label="getDifficultyText(props.row.difficulty)"
                size="sm"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-duration="props">
            <q-td :props="props">
              {{ props.row.duration }} {{ langStore.getText('minutes') }}
            </q-td>
          </template>

          <template v-slot:body-cell-start_date="props">
            <q-td :props="props">
              {{ props.row.start_date ? formatDate(props.row.start_date) : langStore.getText('notSet') }}
            </q-td>
          </template>

          <template v-slot:body-cell-end_date="props">
            <q-td :props="props">
              {{ props.row.end_date ? formatDate(props.row.end_date) : langStore.getText('notSet') }}
            </q-td>
          </template>

          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              {{ formatDate(props.row.created_at) }}
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- View Exam Dialog -->
      <q-dialog v-model="showViewDialog" maximized>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ selectedExam?.title }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section v-if="selectedExam">
            <div class="row q-gutter-lg">
              <div class="col-12 col-md-8">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6">{{ langStore.getText('examDetails') }}</div>

                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('title') }}</q-item-label>
                          <q-item-label>{{ selectedExam.title }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="selectedExam.description">
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('description') }}</q-item-label>
                          <q-item-label>{{ selectedExam.description }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('difficulty') }}</q-item-label>
                          <q-chip
                            :color="getDifficultyColor(selectedExam.difficulty)"
                            text-color="white"
                            :label="getDifficultyText(selectedExam.difficulty)"
                          />
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('duration') }}</q-item-label>
                          <q-item-label>{{ selectedExam.duration }} {{ langStore.getText('minutes') }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('status') }}</q-item-label>
                          <q-chip
                            :color="getStatusColor(selectedExam.status)"
                            text-color="white"
                            :label="getStatusText(selectedExam.status)"
                          />
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('passingScore') }}</q-item-label>
                          <q-item-label>{{ selectedExam.passing_score }}%</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('attemptsAllowed') }}</q-item-label>
                          <q-item-label>{{ selectedExam.attempts_allowed }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-md-4">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6">{{ langStore.getText('examSettings') }}</div>

                    <q-list>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon :name="selectedExam.show_results ? 'check' : 'close'" :color="selectedExam.show_results ? 'positive' : 'negative'" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ langStore.getText('showResults') }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon :name="selectedExam.allow_review ? 'check' : 'close'" :color="selectedExam.allow_review ? 'positive' : 'negative'" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ langStore.getText('allowReview') }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon :name="selectedExam.randomize_questions ? 'check' : 'close'" :color="selectedExam.randomize_questions ? 'positive' : 'negative'" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ langStore.getText('randomizeQuestions') }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon :name="selectedExam.time_limit ? 'check' : 'close'" :color="selectedExam.time_limit ? 'positive' : 'negative'" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ langStore.getText('timeLimit') }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              :label="langStore.getText('viewResults')"
              color="info"
              icon="analytics"
              @click="viewResults(selectedExam!)"
              v-close-popup
            />
            <q-btn
              :label="langStore.getText('edit')"
              color="primary"
              icon="edit"
              @click="editExam(selectedExam!)"
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
import { useRouter } from 'vue-router'
import { DatabaseService, type Exam } from '../lib/database'

const langStore = useLanguageStore()
const $q = useQuasar()
const router = useRouter()

// Reactive data
const loading = ref(false)
const exams = ref<Exam[]>([])
const showViewDialog = ref(false)
const selectedExam = ref<Exam | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const difficultyFilter = ref('')

// Computed
const filteredExams = computed(() => {
  let filtered = exams.value

  if (searchQuery.value) {
    filtered = filtered.filter(exam =>
      exam.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(exam => exam.status === statusFilter.value)
  }

  if (difficultyFilter.value) {
    filtered = filtered.filter(exam => exam.difficulty === difficultyFilter.value)
  }

  return filtered
})

const activeExamsCount = computed(() =>
  exams.value.filter(exam => exam.status === 'active').length
)

const completedExamsCount = computed(() =>
  exams.value.filter(exam => exam.status === 'completed').length
)

const averageScore = computed(() => {
  // This would be calculated from exam attempts in a real implementation
  return 78
})

const statusOptions = [
  { label: 'مسودة', value: 'draft' },
  { label: 'نشط', value: 'active' },
  { label: 'مكتمل', value: 'completed' },
  { label: 'مؤرشف', value: 'archived' }
]

const difficultyOptions = [
  { label: 'سهل', value: 'easy' },
  { label: 'متوسط', value: 'medium' },
  { label: 'صعب', value: 'hard' }
]

const columns = [
  {
    name: 'title',
    label: langStore.getText('title'),
    field: 'title',
    align: 'right' as const,
    sortable: true
  },
  {
    name: 'difficulty',
    label: langStore.getText('difficulty'),
    field: 'difficulty',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'duration',
    label: langStore.getText('duration'),
    field: 'duration',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'status',
    label: langStore.getText('status'),
    field: 'status',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'start_date',
    label: langStore.getText('startDate'),
    field: 'start_date',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'end_date',
    label: langStore.getText('endDate'),
    field: 'end_date',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'created_at',
    label: langStore.getText('createdAt'),
    field: 'created_at',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'actions',
    label: langStore.getText('actions'),
    field: 'actions',
    align: 'center' as const
  }
]

// Methods
function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'positive'
    case 'completed': return 'info'
    case 'draft': return 'warning'
    case 'archived': return 'grey'
    default: return 'grey'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'active': return 'نشط'
    case 'completed': return 'مكتمل'
    case 'draft': return 'مسودة'
    case 'archived': return 'مؤرشف'
    default: return status
  }
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'positive'
    case 'medium': return 'warning'
    case 'hard': return 'negative'
    default: return 'grey'
  }
}

function getDifficultyText(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'سهل'
    case 'medium': return 'متوسط'
    case 'hard': return 'صعب'
    default: return difficulty
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

async function loadExams() {
  try {
    loading.value = true
    exams.value = await DatabaseService.getExams()
  } catch (error) {
    console.error('Error loading exams:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorLoadingExams') || 'حدث خطأ في تحميل الاختبارات'
    })
  } finally {
    loading.value = false
  }
}

function viewExam(exam: Exam) {
  selectedExam.value = exam
  showViewDialog.value = true
}

function editExam(exam: Exam) {
  // TODO: Implement edit functionality
  $q.notify({
    type: 'info',
    message: `تعديل الاختبار: ${exam.title}`
  })
}

function viewResults(exam: Exam) {
  void router.push(`/exams/results?examId=${exam.id}`)
}

function deleteExam(exam: Exam) {
  $q.dialog({
    title: langStore.getText('confirmDelete'),
    message: `${langStore.getText('deleteExamConfirm')} ${exam.title}؟`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await DatabaseService.deleteExam(exam.id)
        exams.value = exams.value.filter(e => e.id !== exam.id)
        $q.notify({
          type: 'positive',
          message: langStore.getText('examDeleted') || 'تم حذف الاختبار بنجاح'
        })
      } catch (error) {
        console.error('Error deleting exam:', error)
        $q.notify({
          type: 'negative',
          message: langStore.getText('errorDeletingExam') || 'حدث خطأ في حذف الاختبار'
        })
      }
    })()
  })
}

onMounted(async () => {
  await loadExams()
})
</script>

<style lang="scss" scoped>
.exams {
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
