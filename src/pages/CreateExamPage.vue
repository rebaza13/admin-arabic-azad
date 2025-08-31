<template>
  <q-page class="create-exam-page">
    <div class="create-exam">
      <!-- Header -->
      <div class="create-exam__header">
        <div class="create-exam__header-content">
          <div>
            <h1 class="create-exam__title">{{ langStore.getText('createExam') }}</h1>
            <p class="create-exam__subtitle">{{ langStore.getText('createNewExam') }}</p>
          </div>
        </div>
      </div>

      <!-- Exam Form -->
      <div class="create-exam__content">
        <!-- Basic Information -->
        <div class="create-exam__main-section">
          <q-card class="create-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('basicInformation') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="create-exam__form-grid">
                <q-input
                  v-model="examForm.title"
                  :label="langStore.getText('examTitle')"
                  outlined
                  :rules="[val => !!val || langStore.getText('titleRequired')]"
                  class="create-exam__full-width"
                />

                <q-input
                  v-model="examForm.description"
                  :label="langStore.getText('description')"
                  type="textarea"
                  outlined
                  rows="3"
                  class="create-exam__full-width"
                />

                <div class="create-exam__form-row">
                  <q-select
                    v-model="examForm.difficulty"
                    :options="difficultyOptions"
                    :label="langStore.getText('difficulty')"
                    outlined
                    :rules="[val => !!val || langStore.getText('difficultyRequired')]"
                    class="create-exam__half-width"
                  />
                  <q-input
                    v-model.number="examForm.duration"
                    :label="langStore.getText('duration')"
                    type="number"
                    outlined
                                         suffix="min"
                    :rules="[val => val > 0 || langStore.getText('durationRequired')]"
                    class="create-exam__half-width"
                  />
                </div>

                <div class="create-exam__form-row">
                  <q-input
                    v-model="examForm.start_date"
                    :label="langStore.getText('startDate') + ' (Optional)'"
                    outlined
                    type="date"
                    class="create-exam__half-width"
                  />
                  <q-input
                    v-model="examForm.end_date"
                    :label="langStore.getText('endDate') + ' (Optional)'"
                    outlined
                    type="date"
                    class="create-exam__half-width"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Questions Section -->
          <q-card class="create-exam__card">
            <q-card-section>
              <div class="create-exam__section-header">
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
              <div v-if="examForm.questions.length === 0" class="create-exam__empty-state">
                <q-icon name="quiz" size="4rem" color="grey-4" />
                <div class="text-grey-6 q-mt-md">{{ langStore.getText('noQuestionsYet') }}</div>
                <q-btn
                  color="primary"
                  icon="add"
                  :label="langStore.getText('addFirstQuestion')"
                  @click="addQuestion"
                  class="q-mt-md"
                />
              </div>

              <div v-else class="create-exam__questions-list">
                <div
                  v-for="(question, index) in examForm.questions"
                  :key="index"
                  class="create-exam__question"
                >
                  <q-card outlined>
                    <q-card-section>
                      <div class="create-exam__question-header">
                        <div class="text-subtitle1">{{ langStore.getText('question') }} {{ index + 1 }}</div>
                        <div class="create-exam__question-actions">
                          <q-btn
                            flat
                            round
                            icon="edit"
                            size="sm"
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
                    </q-card-section>

                    <q-card-section>
                      <q-input
                        v-model="question.text"
                        :label="langStore.getText('questionText')"
                        type="textarea"
                        outlined
                        rows="2"
                        :rules="[val => !!val || langStore.getText('questionRequired')]"
                      />

                      <div class="q-mt-md">
                        <div class="text-subtitle2 q-mb-sm">{{ langStore.getText('options') }}</div>
                        <div class="create-exam__options-list">
                          <div
                            v-for="(option, optionIndex) in question.options"
                            :key="optionIndex"
                            class="create-exam__option-item"
                          >
                            <q-radio
                              v-model="question.correct_answer"
                              :val="optionIndex"
                              color="primary"
                            />
                            <q-input
                              v-model="question.options[optionIndex]"
                              :label="`${langStore.getText('option')} ${optionIndex + 1}`"
                              outlined
                              dense
                              class="create-exam__option-input"
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
        <div class="create-exam__sidebar">
          <q-card class="create-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('examSettings') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="create-exam__settings-grid">
                <q-toggle
                  v-model="examForm.settings.show_results"
                  :label="langStore.getText('showResults')"
                />

                <q-toggle
                  v-model="examForm.settings.allow_review"
                  :label="langStore.getText('allowReview')"
                />

                <q-toggle
                  v-model="examForm.settings.randomize_questions"
                  :label="langStore.getText('randomizeQuestions')"
                />

                <q-toggle
                  v-model="examForm.settings.time_limit"
                  :label="langStore.getText('timeLimit')"
                />

                <q-input
                  v-model.number="examForm.settings.passing_score"
                  :label="langStore.getText('passingScore')"
                  type="number"
                  outlined
                  suffix="%"
                  :disable="!examForm.settings.show_results"
                  :rules="[val => val >= 0 && val <= 100 || 'Score must be between 0 and 100']"
                />

                <q-select
                  v-model="examForm.settings.attempts_allowed"
                  :options="attemptsOptions"
                  :label="langStore.getText('attemptsAllowed')"
                  outlined
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Exam Preview -->
          <q-card class="create-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('examPreview') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="create-exam__preview-list">
                <div class="create-exam__preview-item">
                  <span class="text-caption">{{ langStore.getText('questions') }}</span>
                  <q-chip color="primary" text-color="white" size="sm">
                    {{ examForm.questions.length }}
                  </q-chip>
                </div>
                <div class="create-exam__preview-item">
                  <span class="text-caption">{{ langStore.getText('duration') }}</span>
                  <span class="text-caption">{{ examForm.duration }} {{ langStore.getText('minutes') }}</span>
                </div>
                <div class="create-exam__preview-item">
                  <span class="text-caption">{{ langStore.getText('difficulty') }}</span>
                  <q-chip
                    :color="getDifficultyColor(examForm.difficulty)"
                    text-color="white"
                    size="sm"
                  >
                    {{ getDifficultyText(examForm.difficulty) }}
                  </q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Action Buttons at Bottom -->
      <div class="create-exam__actions">
        <q-btn
          color="grey"
          icon="save"
          :label="langStore.getText('saveDraft')"
          @click="saveDraft"
          size="lg"
        />
        <q-btn
          color="primary"
          icon="publish"
          :label="langStore.getText('publishExam')"
          @click="publishExam"
          size="lg"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'
import { DatabaseService, type Exam } from '../lib/database'
import { useRouter } from 'vue-router'

const langStore = useLanguageStore()
const $q = useQuasar()
const router = useRouter()

// Types
interface Question {
  text: string
  options: string[]
  correct_answer: number
}

interface ExamSettings {
  show_results: boolean
  allow_review: boolean
  randomize_questions: boolean
  time_limit: boolean
  passing_score: number
  attempts_allowed: number
}

interface ExamForm {
  title: string
  description: string
  difficulty: string | { label: string; value: string }
  duration: number
  start_date: string
  end_date: string
  questions: Question[]
  settings: ExamSettings
}

// Reactive data
const examForm = ref<ExamForm>({
  title: '',
  description: '',
  difficulty: '',
  duration: 60,
  start_date: '',
  end_date: '',
  questions: [],
  settings: {
    show_results: true,
    allow_review: true,
    randomize_questions: false,
    time_limit: true,
    passing_score: 60,
    attempts_allowed: 1
  }
})

// Options
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
function addQuestion() {
  examForm.value.questions.push({
    text: '',
    options: ['', ''],
    correct_answer: 0
  })
}

function deleteQuestion(index: number) {
  $q.dialog({
    title: langStore.getText('confirmDelete'),
    message: langStore.getText('deleteQuestionConfirm'),
    cancel: true,
    persistent: true
  }).onOk(() => {
    examForm.value.questions.splice(index, 1)
  })
}

function editQuestion(index: number) {
  // This would open an edit dialog in a real implementation
  $q.notify({
    type: 'info',
    message: `${langStore.getText('editQuestion')} ${index + 1}`
  })
}

function addOption(questionIndex: number) {
  const question = examForm.value.questions[questionIndex]
  if (question) {
    question.options.push('')
  }
}

function deleteOption(questionIndex: number, optionIndex: number) {
  const question = examForm.value.questions[questionIndex]
  if (question && question.options.length > 2) {
    question.options.splice(optionIndex, 1)
    // Adjust correct answer if needed
    if (question.correct_answer >= optionIndex) {
      question.correct_answer = Math.max(0, question.correct_answer - 1)
    }
  }
}

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

async function saveDraft() {
  if (!examForm.value.title) {
    $q.notify({
      type: 'negative',
      message: langStore.getText('titleRequired')
    })
    return
  }

  try {
    if ($q.loading) {
      $q.loading.show({
        message: langStore.getText('saving') || 'Saving...'
      })
    }

    // Prepare exam data
    const examData: Partial<Exam> = {
      title: examForm.value.title,
      description: examForm.value.description,
      difficulty: typeof examForm.value.difficulty === 'object' ? examForm.value.difficulty.value : examForm.value.difficulty,
      duration: examForm.value.duration,
      status: 'draft' as const,
      passing_score: examForm.value.settings.passing_score,
      attempts_allowed: examForm.value.settings.attempts_allowed,
      show_results: examForm.value.settings.show_results,
      allow_review: examForm.value.settings.allow_review,
      randomize_questions: examForm.value.settings.randomize_questions,
      time_limit: examForm.value.settings.time_limit
    }
    
    // Add optional dates only if they exist
    if (examForm.value.start_date) {
      examData.start_date = examForm.value.start_date
    }
    if (examForm.value.end_date) {
      examData.end_date = examForm.value.end_date
    }

    // Create exam
    const exam = await DatabaseService.createExam(examData)
    
    // Save questions if any
    if (examForm.value.questions.length > 0) {
      for (let i = 0; i < examForm.value.questions.length; i++) {
        const question = examForm.value.questions[i]
        if (!question) continue
        
        const questionData = {
          exam_id: exam.id,
          question_text: question.text,
          question_type: 'multiple_choice' as const,
          points: 1,
          order_index: i + 1
        }
        
        const savedQuestion = await DatabaseService.createQuestion(questionData)
        
        // Save options
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j]
          if (option && option.trim()) {
            await DatabaseService.createQuestionOption({
              question_id: savedQuestion.id,
              option_text: option.trim(),
              is_correct: j === question.correct_answer,
              order_index: j + 1
            })
          }
        }
      }
    }

    if ($q.loading) $q.loading.hide()
    $q.notify({
      type: 'positive',
      message: langStore.getText('draftSaved') || 'Draft saved successfully!'
    })
    
    // Redirect to exams list
    await router.push('/exams')
  } catch (error) {
    if ($q.loading) $q.loading.hide()
    console.error('Error saving draft:', error)
    $q.notify({
      type: 'negative',
      message: 'Error saving draft: ' + (error as Error).message
    })
  }
}

async function publishExam() {
  if (!examForm.value.title) {
    $q.notify({
      type: 'negative',
      message: langStore.getText('titleRequired')
    })
    return
  }

  if (examForm.value.questions.length === 0) {
    $q.notify({
      type: 'negative',
      message: langStore.getText('addAtLeastOneQuestion')
    })
    return
  }

  // Validate all questions have text and at least 2 options
  const invalidQuestions = examForm.value.questions.some(q =>
    !q.text || q.options.filter(opt => opt.trim()).length < 2
  )

  if (invalidQuestions) {
    $q.notify({
      type: 'negative',
      message: langStore.getText('completeAllQuestions')
    })
    return
  }

  try {
    if ($q.loading) {
      $q.loading.show({
        message: langStore.getText('publishing') || 'Publishing...'
      })
    }

    // Prepare exam data - start with draft status to avoid constraint issues
    const examData: Partial<Exam> = {
      title: examForm.value.title,
      description: examForm.value.description,
      difficulty: typeof examForm.value.difficulty === 'object' ? examForm.value.difficulty.value : examForm.value.difficulty,
      duration: examForm.value.duration,
      status: 'draft' as const, // Start as draft to avoid constraint issues
      passing_score: examForm.value.settings.passing_score,
      attempts_allowed: examForm.value.settings.attempts_allowed,
      show_results: examForm.value.settings.show_results,
      allow_review: examForm.value.settings.allow_review,
      randomize_questions: examForm.value.settings.randomize_questions,
      time_limit: examForm.value.settings.time_limit
    }
    
    // Add optional dates only if they exist
    if (examForm.value.start_date) {
      examData.start_date = examForm.value.start_date
    }
    if (examForm.value.end_date) {
      examData.end_date = examForm.value.end_date
    }

    // Create exam
    const exam = await DatabaseService.createExam(examData)
    
    // Save questions
    for (let i = 0; i < examForm.value.questions.length; i++) {
      const question = examForm.value.questions[i]
      if (!question) continue
      
      const questionData = {
        exam_id: exam.id,
        question_text: question.text,
        question_type: 'multiple_choice' as const,
        points: 1,
        order_index: i + 1
      }
      
      const savedQuestion = await DatabaseService.createQuestion(questionData)
      
      // Save options
      for (let j = 0; j < question.options.length; j++) {
        const option = question.options[j]
        if (option && option.trim()) {
          await DatabaseService.createQuestionOption({
            question_id: savedQuestion.id,
            option_text: option.trim(),
            is_correct: j === question.correct_answer,
            order_index: j + 1
          })
        }
      }
    }

    // Now try to update status to active if all conditions are met
    // The database constraint might require specific fields for active status
    try {
      // Check if we have all required fields for active status
      const hasRequiredFields = examForm.value.start_date && 
                               examForm.value.questions.length > 0 &&
                               examForm.value.difficulty
      
      if (hasRequiredFields) {
        const updateData: Partial<Exam> = { 
          status: 'active' as const
        }
        
        // Ensure start_date is set (required for active status)
        if (examForm.value.start_date) {
          updateData.start_date = examForm.value.start_date
        }
        
        // Only add end_date if it exists
        if (examForm.value.end_date) {
          updateData.end_date = examForm.value.end_date
        }
        
        await DatabaseService.updateExam(exam.id, updateData)
        
        $q.notify({
          type: 'positive',
          message: 'Exam published and activated successfully!'
        })
      } else {
        // Don't try to activate if missing required fields
        $q.notify({
          type: 'warning',
          message: 'Exam created as draft. Add start date and questions to activate.'
        })
      }
    } catch (updateError) {
      console.warn('Could not set exam status to active:', updateError)
      // Continue anyway - exam is created as draft
      $q.notify({
        type: 'warning',
        message: 'Exam created as draft due to database constraints'
      })
    }

    if ($q.loading) $q.loading.hide()
    $q.notify({
      type: 'positive',
      message: langStore.getText('examPublished') || 'Exam published successfully!'
    })
    
    // Redirect to exams list
    await router.push('/exams')
  } catch (error) {
    if ($q.loading) $q.loading.hide()
    console.error('Error publishing exam:', error)
    $q.notify({
      type: 'negative',
      message: 'Error publishing exam: ' + (error as Error).message
    })
  }
}
</script>

<style lang="scss" scoped>
.create-exam-page {
  padding: 0 !important;
}

.create-exam {
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

  &__question {
    .q-card {
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;

      &:hover {
        border-color: $primary;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
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
