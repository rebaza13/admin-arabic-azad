<template>
  <q-page class="exams-page">
    <div class="exams">
      <!-- Header -->
      <div class="exams__header">
        <div class="exams__header-content">
          <div>
            <h1 class="exams__title">{{ langStore.getText('exams') }}</h1>
            <p class="exams__subtitle">{{ langStore.getText('manageExams') }}</p>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="exams__stats">
        <div class="exams__stats-grid">
          <q-card class="exams__stat-card">
            <q-card-section class="text-center">
              <q-icon name="quiz" size="3rem" color="primary" />
              <div class="text-h4 q-mt-sm">{{ exams.length }}</div>
              <div class="text-subtitle2">{{ langStore.getText('totalExams') }}</div>
            </q-card-section>
          </q-card>
          <q-card class="exams__stat-card">
            <q-card-section class="text-center">
              <q-icon name="schedule" size="3rem" color="warning" />
              <div class="text-h4 q-mt-sm">{{ activeExamsCount }}</div>
              <div class="text-subtitle2">{{ langStore.getText('activeExams') }}</div>
            </q-card-section>
          </q-card>
          <q-card class="exams__stat-card">
            <q-card-section class="text-center">
              <q-icon name="check_circle" size="3rem" color="positive" />
              <div class="text-h4 q-mt-sm">{{ completedExamsCount }}</div>
              <div class="text-subtitle2">{{ langStore.getText('completedExams') }}</div>
            </q-card-section>
          </q-card>

        </div>
      </div>

      <!-- Search and Filters -->
      <div class="exams__filters">
        <div class="exams__filters-grid">
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
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            :label="langStore.getText('status')"
            outlined
            dense
            clearable
          />
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
              <div class="row items-center q-gutter-sm">
                <q-toggle
                  v-model="props.row.status"
                  :color="props.row.status === 'active' ? 'positive' : 'grey'"
                  :icon="props.row.status === 'active' ? 'check' : 'block'"
                  size="sm"
                  :true-value="'active'"
                  :false-value="'draft'"
                  @update:model-value="toggleExamStatus(props.row)"
                />
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  :label="getStatusText(props.row.status)"
                  size="sm"
                />
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-difficulty="props">
            <q-td :props="props">
              <q-chip
                :color="getDifficultyColor(props.row.difficulty)"
                :label="getDifficultyText(props.row.difficulty)"
                text-color="white"
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

      <!-- Create Exam Button at Bottom -->
      <div class="exams__actions">
        <q-btn
          color="primary"
          icon="add"
          :label="langStore.getText('createExam')"
          size="lg"
          @click="$router.push('/exams/create')"
        />
      </div>

      <!-- View Exam Dialog -->
      <q-dialog v-model="showViewDialog" maximized>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ selectedExam?.title }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section v-if="selectedExam">
            <div class="exams__dialog-content">
              <div class="exams__dialog-main">
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

              <div class="exams__dialog-sidebar">
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

const statusOptions = computed(() => [
  { label: langStore.getText('draft'), value: 'draft' },
  { label: langStore.getText('active'), value: 'active' },
  { label: langStore.getText('completed'), value: 'completed' },
  { label: langStore.getText('archived'), value: 'archived' }
])

const difficultyOptions = computed(() => [
  { label: langStore.getText('easy'), value: 'easy' },
  { label: langStore.getText('medium'), value: 'medium' },
  { label: langStore.getText('hard'), value: 'hard' }
])

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
    case 'active': return langStore.getText('active')
    case 'completed': return langStore.getText('completed')
    case 'draft': return langStore.getText('draft')
    case 'archived': return langStore.getText('archived')
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
    case 'easy': return langStore.getText('easy')
    case 'medium': return langStore.getText('medium')
    case 'hard': return langStore.getText('hard')
    default: return difficulty
  }
}

function formatDate(dateString: string): string {
  const locale = langStore.currentLanguage === 'ar' ? 'ar-SA' : 'en-US'
  return new Date(dateString).toLocaleDateString(locale)
}

async function loadExams() {
  try {
    loading.value = true
    exams.value = await DatabaseService.getExams()
  } catch (error) {
    console.error('Error loading exams:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorLoadingExams')
    })
  } finally {
    loading.value = false
  }
}

function viewExam(exam: Exam) {
  selectedExam.value = exam
  showViewDialog.value = true
  // Load questions for this exam
  loadExamQuestions(exam.id)
}

async function loadExamQuestions(examId: string) {
  try {
    const questions = await DatabaseService.getQuestions(examId)
    if (selectedExam.value) {
      selectedExam.value.questions = questions
    }
  } catch (error) {
    console.error('Error loading questions:', error)
  }
}

function editExam(exam: Exam) {
  router.push(`/exams/${exam.id}/edit`)
}

async function toggleExamStatus(exam: Exam) {
  try {
    // Toggle between draft and active status
    const newStatus = exam.status === 'active' ? 'draft' : 'active'
    
    // If trying to set to active, check if required fields are present
    if (newStatus === 'active') {
      // Check if exam has required fields for active status
      if (!exam.start_date) {
        $q.notify({
          type: 'warning',
          message: 'Cannot activate exam without start date. Please edit the exam first.'
        })
        return
      }
      
      // Check if exam has questions
      const examQuestions = await DatabaseService.getQuestions(exam.id)
      if (!examQuestions || examQuestions.length === 0) {
        $q.notify({
          type: 'warning',
          message: 'Cannot activate exam without questions. Please add questions first.'
        })
        return
      }
    }
    
    await DatabaseService.updateExam(exam.id, { status: newStatus })
    exam.status = newStatus
    $q.notify({
      type: 'positive',
      message: langStore.getText('examStatusToggled')
    })
  } catch (error) {
    console.error('Error toggling exam status:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorTogglingExamStatus')
    })
  }
}

function deleteExam(exam: Exam) {
  $q.dialog({
    title: langStore.getText('confirmDelete'),
    message: `${langStore.getText('deleteExamConfirm')} ${exam.title}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await DatabaseService.deleteExam(exam.id)
        exams.value = exams.value.filter(e => e.id !== exam.id)
        $q.notify({
          type: 'positive',
          message: langStore.getText('examDeleted')
        })
      } catch (error) {
        console.error('Error deleting exam:', error)
        $q.notify({
          type: 'negative',
          message: langStore.getText('errorDeletingExam')
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
.exams-page {
  padding: 0 !important;
}

.exams {
  padding: 2rem;
  width: 100%;
  max-width: 100%;

  &__header {
    margin-bottom: 2rem;
  }

  &__header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  &__stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 600px;
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
    margin-bottom: 2rem;
  }

  &__filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  &__table-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }

  &__actions {
    margin-top: 2rem;
    text-align: center;
  }

  &__dialog-content {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &__dialog-main {
    flex: 2;
  }

  &__dialog-sidebar {
    flex: 1;
  }

  // Responsive design
  @media (max-width: 768px) {
    padding: 1rem;

    &__stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    &__filters-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    &__dialog-content {
      flex-direction: column;
    }
  }
}
</style>
