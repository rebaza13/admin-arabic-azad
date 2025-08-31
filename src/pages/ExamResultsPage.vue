<template>
  <q-page class="q-pa-md">
    <div class="exam-results">
      <!-- Header -->
      <div class="exam-results__header">
        <div class="row items-center justify-between">
          <div>
            <h1 class="exam-results__title">{{ langStore.getText('examResults') }}</h1>
            <p class="exam-results__subtitle">{{ langStore.getText('viewExamResults') }}</p>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              color="secondary"
              icon="arrow_back"
              :label="langStore.getText('backToExams')"
              @click="$router.push('/exams')"
            />
            <q-btn
              color="primary"
              icon="download"
              :label="langStore.getText('exportResults')"
              @click="exportResults"
            />
          </div>
        </div>
      </div>

      <!-- Exam Selection -->
      <div v-if="!selectedExamId" class="exam-results__selection q-mb-lg">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ langStore.getText('selectExam') }}</div>
            <q-select
              v-model="selectedExamId"
              :options="examOptions"
              :label="langStore.getText('chooseExam')"
              outlined
              @update:model-value="loadExamResults"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="exam-results__loading">
        <q-spinner-dots size="3rem" color="primary" />
        <p class="q-mt-md">{{ langStore.getText('loading') }}...</p>
      </div>

      <!-- Results Content -->
      <div v-else-if="selectedExamId && examAttempts.length > 0" class="exam-results__content">
        <!-- Exam Info -->
        <q-card class="exam-results__exam-info q-mb-lg">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h5">{{ selectedExam?.title }}</div>
                <div class="text-subtitle1 text-grey-6">{{ selectedExam?.description }}</div>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="getDifficultyColor(selectedExam?.difficulty || 'medium')"
                  text-color="white"
                  :label="getDifficultyText(selectedExam?.difficulty || 'medium')"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Statistics Cards -->
        <div class="exam-results__stats q-mb-lg">
          <div class="row q-gutter-md">
            <div class="col-md-3">
              <q-card class="exam-results__stat-card">
                <q-card-section class="text-center">
                  <q-icon name="people" size="3rem" color="primary" />
                  <div class="text-h4 q-mt-sm">{{ examAttempts.length }}</div>
                  <div class="text-subtitle2">{{ langStore.getText('totalParticipants') }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3">
              <q-card class="exam-results__stat-card">
                <q-card-section class="text-center">
                  <q-icon name="analytics" size="3rem" color="info" />
                  <div class="text-h4 q-mt-sm">{{ averageScore }}%</div>
                  <div class="text-subtitle2">{{ langStore.getText('averageScore') }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3">
              <q-card class="exam-results__stat-card">
                <q-card-section class="text-center">
                  <q-icon name="check_circle" size="3rem" color="positive" />
                  <div class="text-h4 q-mt-sm">{{ passedCount }}</div>
                  <div class="text-subtitle2">{{ langStore.getText('passedStudents') }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3">
              <q-card class="exam-results__stat-card">
                <q-card-section class="text-center">
                  <q-icon name="cancel" size="3rem" color="negative" />
                  <div class="text-h4 q-mt-sm">{{ failedCount }}</div>
                  <div class="text-subtitle2">{{ langStore.getText('failedStudents') }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Score Distribution Chart -->
        <div class="row q-gutter-lg q-mb-lg">
          <div class="col-12 col-lg-8">
            <q-card class="exam-results__chart-card">
              <q-card-section>
                <div class="text-h6">{{ langStore.getText('scoreDistribution') }}</div>
                <div class="exam-results__score-chart q-mt-md">
                  <div class="row q-gutter-sm">
                    <div class="col">
                      <div class="exam-results__score-bar">
                        <div class="exam-results__score-label">0-20%</div>
                        <div class="exam-results__score-bar-bg">
                          <div
                            class="exam-results__score-bar-fill"
                            :style="{ width: `${scoreDistribution['0-20']}%`, backgroundColor: '#f56565' }"
                          ></div>
                        </div>
                        <div class="exam-results__score-count">{{ scoreDistribution['0-20'] }}</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="exam-results__score-bar">
                        <div class="exam-results__score-label">21-40%</div>
                        <div class="exam-results__score-bar-bg">
                          <div
                            class="exam-results__score-bar-fill"
                            :style="{ width: `${scoreDistribution['21-40']}%`, backgroundColor: '#ed8936' }"
                          ></div>
                        </div>
                        <div class="exam-results__score-count">{{ scoreDistribution['21-40'] }}</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="exam-results__score-bar">
                        <div class="exam-results__score-label">41-60%</div>
                        <div class="exam-results__score-bar-bg">
                          <div
                            class="exam-results__score-bar-fill"
                            :style="{ width: `${scoreDistribution['41-60']}%`, backgroundColor: '#ecc94b' }"
                          ></div>
                        </div>
                        <div class="exam-results__score-count">{{ scoreDistribution['41-60'] }}</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="exam-results__score-bar">
                        <div class="exam-results__score-label">61-80%</div>
                        <div class="exam-results__score-bar-bg">
                          <div
                            class="exam-results__score-bar-fill"
                            :style="{ width: `${scoreDistribution['61-80']}%`, backgroundColor: '#48bb78' }"
                          ></div>
                        </div>
                        <div class="exam-results__score-count">{{ scoreDistribution['61-80'] }}</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="exam-results__score-bar">
                        <div class="exam-results__score-label">81-100%</div>
                        <div class="exam-results__score-bar-bg">
                          <div
                            class="exam-results__score-bar-fill"
                            :style="{ width: `${scoreDistribution['81-100']}%`, backgroundColor: '#38a169' }"
                          ></div>
                        </div>
                        <div class="exam-results__score-count">{{ scoreDistribution['81-100'] }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-4">
            <q-card class="exam-results__summary-card">
              <q-card-section>
                <div class="text-h6">{{ langStore.getText('examSummary') }}</div>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('passingScore') }}</q-item-label>
                      <q-item-label>{{ selectedExam?.passing_score }}%</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('passRate') }}</q-item-label>
                      <q-item-label>{{ passRate }}%</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('highestScore') }}</q-item-label>
                      <q-item-label>{{ highestScore }}%</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('lowestScore') }}</q-item-label>
                      <q-item-label>{{ lowestScore }}%</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>{{ langStore.getText('averageTime') }}</q-item-label>
                      <q-item-label>{{ averageTime }} {{ langStore.getText('minutes') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Results Table -->
        <q-card class="exam-results__table-card">
          <q-card-section>
            <div class="text-h6">{{ langStore.getText('studentResults') }}</div>
          </q-card-section>

          <q-card-section>
            <q-table
              :rows="examAttempts"
              :columns="columns"
              row-key="id"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template v-slot:body-cell-student="props">
                <q-td :props="props">
                  <div>
                    <div class="text-weight-medium">{{ props.row.student?.name || 'Unknown' }}</div>
                    <div class="text-caption text-grey-6">{{ props.row.student?.email || '' }}</div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-score="props">
                <q-td :props="props">
                  <div class="row items-center">
                    <div class="col">
                      <div class="text-weight-medium">{{ props.row.percentage }}%</div>
                      <div class="text-caption">{{ props.row.score }}/{{ props.row.max_score }}</div>
                    </div>
                    <div class="col-auto">
                      <q-chip
                        :color="props.row.is_passed ? 'positive' : 'negative'"
                        text-color="white"
                        :label="props.row.is_passed ? langStore.getText('passed') : langStore.getText('failed')"
                        size="sm"
                      />
                    </div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-time="props">
                <q-td :props="props">
                  {{ formatDuration(props.row.start_time, props.row.end_time) }}
                </q-td>
              </template>

              <template v-slot:body-cell-attempt="props">
                <q-td :props="props">
                  <q-chip
                    :color="props.row.attempt_number === 1 ? 'primary' : 'warning'"
                    text-color="white"
                    :label="`${langStore.getText('attempt')} ${props.row.attempt_number}`"
                    size="sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    icon="visibility"
                    size="sm"
                    color="info"
                    @click="viewAttemptDetails(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- No Results State -->
      <div v-else-if="selectedExamId && examAttempts.length === 0" class="exam-results__empty">
        <q-icon name="analytics" size="5rem" color="grey-4" />
        <h3 class="q-mt-md">{{ langStore.getText('noResults') }}</h3>
        <p class="text-grey-6">{{ langStore.getText('noResultsDescription') }}</p>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { DatabaseService, type Exam, type ExamAttempt, type Student } from '../lib/database'

// Extended interface for exam attempts with student info
interface ExamAttemptWithStudent extends ExamAttempt {
  student?: Student
}

const langStore = useLanguageStore()
const $q = useQuasar()
const route = useRoute()

// Reactive data
const loading = ref(false)
const exams = ref<Exam[]>([])
const examAttempts = ref<ExamAttemptWithStudent[]>([])
const selectedExamId = ref<string | null>(null)
const selectedExam = ref<Exam | null>(null)

// Computed
const examOptions = computed(() => {
  return exams.value.map(exam => ({
    label: exam.title,
    value: exam.id
  }))
})

const averageScore = computed(() => {
  if (examAttempts.value.length === 0) return 0
  const total = examAttempts.value.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0)
  return Math.round(total / examAttempts.value.length)
})

const passedCount = computed(() => {
  return examAttempts.value.filter(attempt => attempt.is_passed).length
})

const failedCount = computed(() => {
  return examAttempts.value.filter(attempt => !attempt.is_passed).length
})

const passRate = computed(() => {
  if (examAttempts.value.length === 0) return 0
  return Math.round((passedCount.value / examAttempts.value.length) * 100)
})

const highestScore = computed(() => {
  if (examAttempts.value.length === 0) return 0
  return Math.max(...examAttempts.value.map(attempt => attempt.percentage || 0))
})

const lowestScore = computed(() => {
  if (examAttempts.value.length === 0) return 0
  return Math.min(...examAttempts.value.map(attempt => attempt.percentage || 0))
})

const averageTime = computed(() => {
  if (examAttempts.value.length === 0) return 0
  const totalTime = examAttempts.value.reduce((sum, attempt) => {
    if (attempt.start_time && attempt.end_time) {
      const start = new Date(attempt.start_time)
      const end = new Date(attempt.end_time)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60) // Convert to minutes
    }
    return sum
  }, 0)
  return Math.round(totalTime / examAttempts.value.length)
})

const scoreDistribution = computed(() => {
  const distribution = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0
  }

  examAttempts.value.forEach(attempt => {
    const score = attempt.percentage || 0
    if (score <= 20) distribution['0-20']++
    else if (score <= 40) distribution['21-40']++
    else if (score <= 60) distribution['41-60']++
    else if (score <= 80) distribution['61-80']++
    else distribution['81-100']++
  })

  // Convert to percentages
  const total = examAttempts.value.length
  if (total > 0) {
    Object.keys(distribution).forEach(key => {
      distribution[key as keyof typeof distribution] = Math.round((distribution[key as keyof typeof distribution] / total) * 100)
    })
  }

  return distribution
})

const columns = [
  {
    name: 'student',
    label: langStore.getText('student'),
    field: 'student',
    align: 'right',
    sortable: true
  },
  {
    name: 'score',
    label: langStore.getText('score'),
    field: 'percentage',
    align: 'center',
    sortable: true
  },
  {
    name: 'time',
    label: langStore.getText('timeSpent'),
    field: 'time',
    align: 'center',
    sortable: true
  },
  {
    name: 'attempt',
    label: langStore.getText('attempt'),
    field: 'attempt_number',
    align: 'center',
    sortable: true
  },
  {
    name: 'submitted',
    label: langStore.getText('submitted'),
    field: 'end_time',
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

function formatDuration(startTime: string, endTime?: string): string {
  if (!endTime) return langStore.getText('inProgress')

  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.round(diffMs / (1000 * 60))

  return `${diffMins} ${langStore.getText('minutes')}`
}

async function loadExams() {
  try {
    exams.value = await DatabaseService.getExams()
  } catch (error) {
    console.error('Error loading exams:', error)
  }
}

async function loadExamResults() {
  if (!selectedExamId.value) return

  try {
    loading.value = true

    // Load exam details and attempts
    const [examData, attemptsData] = await Promise.all([
      DatabaseService.getExams().then(exams => exams.find(e => e.id === selectedExamId.value)),
      DatabaseService.getExamAttempts(selectedExamId.value)
    ])

    selectedExam.value = examData || null
    examAttempts.value = attemptsData
  } catch (error) {
    console.error('Error loading exam results:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorLoadingResults') || 'حدث خطأ في تحميل النتائج'
    })
  } finally {
    loading.value = false
  }
}

function viewAttemptDetails(attempt: ExamAttemptWithStudent) {
  // TODO: Implement detailed view
  $q.notify({
    type: 'info',
    message: `عرض تفاصيل محاولة الطالب: ${attempt.student?.name || 'غير محدد'}`
  })
}

function exportResults() {
  // TODO: Implement export functionality
  $q.notify({
    type: 'info',
    message: langStore.getText('exportFeature') || 'ميزة التصدير قيد التطوير'
  })
}

onMounted(async () => {
  await loadExams()

  // Check if examId is provided in route params
  const examId = route.query.examId as string
  if (examId) {
    selectedExamId.value = examId
    await loadExamResults()
  }
})
</script>

<style lang="scss" scoped>
.exam-results {
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

  &__selection {
    margin-bottom: 2rem;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: #64748b;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
  }

  &__exam-info {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
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

  &__chart-card,
  &__summary-card {
    height: 100%;
  }

  &__score-chart {
    .row {
      height: 200px;
    }
  }

  &__score-bar {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }

  &__score-label {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  &__score-bar-bg {
    width: 100%;
    height: 120px;
    background: #f1f5f9;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  &__score-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 8px;
  }

  &__score-count {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 0.5rem;
    color: $dark;
  }

  &__table-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }
}
</style>
