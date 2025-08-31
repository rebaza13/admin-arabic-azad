<template>
  <q-page class="edit-exam-page">
    <div class="edit-exam">
      <!-- Header -->
      <div class="edit-exam__header">
        <div class="edit-exam__header-content">
          <div>
            <h1 class="edit-exam__title">{{ langStore.getText('editExam') }}</h1>
            <p class="edit-exam__subtitle">{{ langStore.getText('editExistingExam') }}</p>
          </div>
        </div>
      </div>

      <!-- Exam Form -->
      <div class="edit-exam__content">
        <!-- Basic Information -->
        <div class="edit-exam__main-section">
          <q-card class="edit-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('basicInformation') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="edit-exam__form-grid">
                <q-input
                  v-model="examForm.title"
                  :label="langStore.getText('examTitle')"
                  outlined
                  :rules="[val => !!val || langStore.getText('titleRequired')]"
                  class="edit-exam__full-width"
                />

                <q-input
                  v-model="examForm.description"
                  :label="langStore.getText('description')"
                  outlined
                  rows="3"
                  class="edit-exam__full-width"
                />

                <div class="edit-exam__form-row">
                  <q-select
                    v-model="examForm.difficulty"
                    :options="difficultyOptions"
                    :label="langStore.getText('difficulty')"
                    outlined
                    :rules="[val => !!val || langStore.getText('difficultyRequired')]"
                    class="edit-exam__half-width"
                  />
                  <q-input
                    v-model.number="examForm.duration"
                    :label="langStore.getText('duration')"
                    type="number"
                    outlined
                    suffix="min"
                    :rules="[val => val > 0 || langStore.getText('durationRequired')]"
                    class="edit-exam__half-width"
                  />
                </div>

                <div class="edit-exam__form-row">
                  <q-input
                    v-model="examForm.start_date"
                    :label="langStore.getText('startDate') + ' (Optional)'"
                    outlined
                    type="date"
                    class="edit-exam__half-width"
                  />
                  <q-input
                    v-model="examForm.end_date"
                    :label="langStore.getText('endDate') + ' (Optional)'"
                    outlined
                    type="date"
                    class="edit-exam__half-width"
                  />
                </div>

                <div class="edit-exam__form-row">
                  <q-input
                    v-model.number="examForm.passing_score"
                    :label="langStore.getText('passingScore')"
                    type="number"
                    outlined
                    suffix="%"
                    :rules="[val => val >= 0 && val <= 100 || 'Score must be between 0 and 100']"
                    class="edit-exam__half-width"
                  />
                  <q-select
                    v-model="examForm.attempts_allowed"
                    :options="attemptsOptions"
                    :label="langStore.getText('attemptsAllowed')"
                    outlined
                    class="edit-exam__half-width"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Questions Section -->
          <q-card class="edit-exam__card">
            <q-card-section>
              <div class="edit-exam__section-header">
                <div class="text-h6">{{ langStore.getText('questions') }}</div>
                <q-btn
                  color="primary"
                  icon="add"
                  :label="langStore.getText('addQuestion')"
                  @click="addQuestion"
                />
              </div>
            </q-card-section>

            <q-card-section>
              <div v-if="questions.length === 0" class="edit-exam__empty-state">
                <q-icon name="quiz" size="4rem" color="grey-4" />
                <div class="text-grey-6 q-mt-md">{{ langStore.getText('noQuestionsYet') }}</div>
                <q-btn
                  color="primary"
                  :label="langStore.getText('addFirstQuestion')"
                  @click="addQuestion"
                  class="q-mt-md"
                />
              </div>

              <div v-else class="edit-exam__questions-list">
                <div
                  v-for="(question, index) in questions"
                  :key="index"
                  class="edit-exam__question"
                >
                  <q-card outlined>
                    <q-card-section>
                      <div class="edit-exam__question-header">
                        <div class="text-subtitle1">{{ langStore.getText('question') }} {{ index + 1 }}</div>
                        <div class="edit-exam__question-actions">
                          <q-btn
                            flat
                            round
                            icon="edit"
                            size="sm"
                            color="primary"
                            @click="editQuestion(index)"
                          />
                          <q-btn
                            flat
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="deleteQuestion(index)"
                          />
                        </div>
                      </div>

                      <q-input
                        v-model="question.question_text"
                        :label="langStore.getText('questionText')"
                        outlined
                        rows="2"
                        :rules="[val => !!val || langStore.getText('questionRequired')]"
                      />

                      <div class="q-mt-md">
                        <div class="text-subtitle2 q-mb-sm">{{ langStore.getText('options') }}</div>
                        <div class="edit-exam__options-list">
                          <div
                            v-for="(option, optionIndex) in question.options"
                            :key="optionIndex"
                            class="edit-exam__option-item"
                          >
                            <q-radio
                              :model-value="option.is_correct"
                              @update:model-value="setCorrectOption(index, optionIndex)"
                              color="primary"
                            />
                            <q-input
                              v-model="option.option_text"
                              :label="`${langStore.getText('option')} ${optionIndex + 1}`"
                              outlined
                              dense
                              class="edit-exam__option-input"
                            />
                            <q-btn
                              flat
                              round
                              icon="delete"
                              size="sm"
                              color="negative"
                              @click="deleteOption(index, optionIndex)"
                              :disable="question.options.length <= 2"
                            />
                          </div>
                        </div>
                        <q-btn
                          flat
                          icon="add"
                          :label="langStore.getText('addOption')"
                          @click="addOption(index)"
                          class="q-mt-sm"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Settings Sidebar -->
        <div class="edit-exam__sidebar">
          <q-card class="edit-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('examSettings') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="edit-exam__settings-grid">
                <q-toggle
                  v-model="examForm.show_results"
                  :label="langStore.getText('showResults')"
                />

                <q-toggle
                  v-model="examForm.allow_review"
                  :label="langStore.getText('allowReview')"
                />

                <q-toggle
                  v-model="examForm.randomize_questions"
                  :label="langStore.getText('randomizeQuestions')"
                />

                <q-toggle
                  v-model="examForm.time_limit"
                  :label="langStore.getText('timeLimit')"
                />

                <q-input
                  v-if="examForm.show_results"
                  v-model.number="examForm.passing_score"
                  :label="langStore.getText('passingScore')"
                  type="number"
                  outlined
                  suffix="%"
                  :disable="!examForm.show_results"
                  :rules="[val => val >= 0 && val <= 100 || 'Score must be between 0 and 100']"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Exam Preview -->
          <q-card class="edit-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('examPreview') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="edit-exam__preview-list">
                <div class="edit-exam__preview-item">
                  <span class="text-caption">{{ langStore.getText('questions') }}</span>
                  <q-chip color="primary" text-color="white" size="sm">
                    {{ questions.length }}
                  </q-chip>
                </div>
                <div class="edit-exam__preview-item">
                  <span class="text-caption">{{ langStore.getText('duration') }}</span>
                  <span class="text-caption">{{ examForm.duration }} {{ langStore.getText('minutes') }}</span>
                </div>
                <div class="edit-exam__preview-item">
                  <span class="text-caption">{{ langStore.getText('difficulty') }}</span>
                  <q-chip
                    :color="getDifficultyColor(examForm.difficulty)"
                    :label="getDifficultyText(examForm.difficulty)"
                    text-color="white"
                    size="sm"
                  />
                </div>
                <div class="edit-exam__preview-item">
                  <span class="text-caption">{{ langStore.getText('status') }}</span>
                  <q-chip
                    :color="getStatusColor(examForm.status)"
                    text-color="white"
                    :label="getStatusText(examForm.status)"
                    size="sm"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Action Buttons at Bottom -->
      <div class="edit-exam__actions">
        <q-btn
          color="grey"
          icon="cancel"
          :label="langStore.getText('cancel')"
          @click="$router.push('/exams')"
          size="lg"
        />
        <q-btn
          color="primary"
          icon="save"
          :label="langStore.getText('updateExam')"
          @click="updateExam"
          size="lg"
          :loading="updating"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { DatabaseService, type Exam, type Question, type QuestionOption } from '../lib/database'

const langStore = useLanguageStore()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()

// Reactive data
const updating = ref(false)
const examForm = ref<Exam>({
  id: '',
  title: '',
  description: '',
  difficulty: 'medium',
  duration: 60,
  status: 'draft',
  start_date: '',
  end_date: '',
  passing_score: 70,
  attempts_allowed: 1,
  show_results: true,
  allow_review: false,
  randomize_questions: false,
  time_limit: false,
  created_at: '',
  updated_at: '',
  questions: []
})

const questions = ref<Question[]>([])

// Computed
const difficultyOptions = computed(() => [
  { label: langStore.getText('easy'), value: 'easy' },
  { label: langStore.getText('medium'), value: 'medium' },
  { label: langStore.getText('hard'), value: 'hard' }
])

const attemptsOptions = computed(() => [
  { label: langStore.getText('oneAttempt'), value: 1 },
  { label: langStore.getText('twoAttempts'), value: 2 },
  { label: langStore.getText('threeAttempts'), value: 3 },
  { label: langStore.getText('unlimited'), value: -1 }
])

// Methods
function getDifficultyColor(difficulty: string | { label: string; value: string }): string {
  const diffValue = typeof difficulty === 'object' ? difficulty.value : difficulty
  switch (diffValue) {
    case 'easy': return 'positive'
    case 'medium': return 'warning'
    case 'hard': return 'negative'
    default: return 'grey'
  }
}

function getDifficultyText(difficulty: string | { label: string; value: string }): string {
  const diffValue = typeof difficulty === 'object' ? difficulty.value : difficulty
  switch (diffValue) {
    case 'easy': return langStore.getText('easy')
    case 'medium': return langStore.getText('medium')
    case 'hard': return langStore.getText('hard')
    default: return diffValue
  }
}

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

function addQuestion() {
  const newQuestion: Question = {
    id: `temp_${Date.now()}`,
    exam_id: examForm.value.id,
    question_text: '',
    question_type: 'multiple_choice',
    points: 1,
    order_index: questions.value.length,
    created_at: new Date().toISOString(),
    options: [
      { id: `opt_${Date.now()}_1`, question_id: '', option_text: '', is_correct: true, order_index: 0, created_at: new Date().toISOString() },
      { id: `opt_${Date.now()}_2`, question_id: '', option_text: '', is_correct: false, order_index: 1, created_at: new Date().toISOString() }
    ]
  }
  questions.value.push(newQuestion)
}

function deleteQuestion(index: number) {
  questions.value.splice(index, 1)
  // Reorder remaining questions
  questions.value.forEach((q, i) => {
    q.order_index = i
  })
}

function addOption(questionIndex: number) {
  const question = questions.value[questionIndex]
  if (!question || !question.options) return
  
  const newOption: QuestionOption = {
    id: `opt_${Date.now()}`,
    question_id: question.id,
    option_text: '',
    is_correct: false,
    order_index: question.options.length,
    created_at: new Date().toISOString()
  }
  question.options.push(newOption)
}

function deleteOption(questionIndex: number, optionIndex: number) {
  const question = questions.value[questionIndex]
  if (!question || !question.options) return
  
  if (question.options.length > 2) {
    question.options.splice(optionIndex, 1)
    // Reorder remaining options
    question.options.forEach((opt, i) => {
      opt.order_index = i
    })
  }
}

function editQuestion(index: number) {
  // This could open a dialog for editing the question
  $q.notify({
    type: 'info',
    message: `${langStore.getText('editQuestion')} ${index + 1}`
  })
}

function setCorrectOption(questionIndex: number, optionIndex: number) {
  const question = questions.value[questionIndex]
  if (!question || !question.options) return
  
  question.options.forEach((opt, i) => {
    opt.is_correct = i === optionIndex
  })
}

async function loadExam() {
  try {
    const examId = route.params.id as string
    const exam = await DatabaseService.getExam(examId)
    if (exam) {
      examForm.value = { ...exam }
      // Load questions for this exam
      const examQuestions = await DatabaseService.getQuestions(examId)
      questions.value = examQuestions
    }
  } catch (error) {
    console.error('Error loading exam:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorLoadingExam')
    })
  }
}

async function updateExam() {
  try {
    updating.value = true
    
    // Validate form
    if (!examForm.value.title || !examForm.value.difficulty || examForm.value.duration <= 0) {
      $q.notify({
        type: 'negative',
        message: langStore.getText('fillAllFieldsRequired')
      })
      return
    }

    if (questions.value.length === 0) {
      $q.notify({
        type: 'negative',
        message: langStore.getText('addAtLeastOneQuestion')
      })
      return
    }

    // Update exam
    await DatabaseService.updateExam(examForm.value.id, examForm.value)
    
    // Update questions
    for (const question of questions.value) {
      if (question.id.startsWith('temp_')) {
        // New question
        await DatabaseService.createQuestion({
          exam_id: examForm.value.id,
          question_text: question.question_text,
          question_type: question.question_type,
          points: question.points,
          order_index: question.order_index
        })
      } else {
        // Existing question
        await DatabaseService.updateQuestion(question.id, {
          question_text: question.question_text,
          points: question.points,
          order_index: question.order_index
        })
      }
    }

    $q.notify({
      type: 'positive',
      message: langStore.getText('examUpdated')
    })

    router.push('/exams')
  } catch (error) {
    console.error('Error updating exam:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorUpdatingExam')
    })
  } finally {
    updating.value = false
  }
}

onMounted(async () => {
  await loadExam()
})
</script>

<style lang="scss" scoped>
.edit-exam-page {
  padding: 0 !important;
}

.edit-exam {
  padding: 2rem;
  width: 100%;
  max-width: 100%;

  &__header {
    margin-bottom: 2rem;
  }

  &__header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  &__content {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  &__main-section {
    flex: 2;
  }

  &__sidebar {
    flex: 1;
    min-width: 300px;
  }

  &__card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  &__form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  &__form-row {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  &__full-width {
    grid-column: 1 / -1;
  }

  &__half-width {
    width: 100%;
  }

  &__section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__empty-state {
    text-align: center;
    padding: 2rem 0;
  }

  &__questions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__question-actions {
    display: flex;
    gap: 0.5rem;
  }

  &__options-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__option-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__option-input {
    flex: 1;
  }

  &__settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  &__preview-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__preview-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
  }

  // Responsive design
  @media (max-width: 1024px) {
    &__content {
      flex-direction: column;
    }

    &__sidebar {
      flex: none;
      min-width: auto;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    &__form-row {
      flex-direction: column;
    }

    &__actions {
      flex-direction: column;
    }
  }
}
</style>
