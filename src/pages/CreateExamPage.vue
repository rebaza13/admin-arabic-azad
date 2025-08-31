<template>
  <q-page class="q-pa-md">
    <div class="create-exam">
      <!-- Header -->
      <div class="create-exam__header">
        <div class="row items-center justify-between">
          <div>
            <h1 class="create-exam__title">{{ langStore.getText('createExam') }}</h1>
            <p class="create-exam__subtitle">{{ langStore.getText('createNewExam') }}</p>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              color="grey"
              icon="save"
              :label="langStore.getText('saveDraft')"
              @click="saveDraft"
            />
            <q-btn
              color="primary"
              icon="publish"
              :label="langStore.getText('publishExam')"
              @click="publishExam"
            />
          </div>
        </div>
      </div>

      <!-- Exam Form -->
      <div class="row q-gutter-lg">
        <!-- Basic Information -->
        <div class="col-md-8">
          <q-card class="create-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('basicInformation') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="q-gutter-md">
                <q-input
                  v-model="examForm.title"
                  :label="langStore.getText('examTitle')"
                  outlined
                  :rules="[val => !!val || langStore.getText('titleRequired')]"
                />

                <q-input
                  v-model="examForm.description"
                  :label="langStore.getText('description')"
                  type="textarea"
                  outlined
                  rows="3"
                />

                <div class="row q-gutter-md">
                  <div class="col-md-6">
                    <q-select
                      v-model="examForm.difficulty"
                      :options="difficultyOptions"
                      :label="langStore.getText('difficulty')"
                      outlined
                      :rules="[val => !!val || langStore.getText('difficultyRequired')]"
                    />
                  </div>
                  <div class="col-md-6">
                    <q-input
                      v-model.number="examForm.duration"
                      :label="langStore.getText('duration')"
                      type="number"
                      outlined
                      suffix="دقيقة"
                      :rules="[val => val > 0 || langStore.getText('durationRequired')]"
                    />
                  </div>
                </div>

                <div class="row q-gutter-md">
                  <div class="col-md-6">
                    <q-input
                      v-model="examForm.start_date"
                      :label="langStore.getText('startDate')"
                      outlined
                      type="date"
                    />
                  </div>
                  <div class="col-md-6">
                    <q-input
                      v-model="examForm.end_date"
                      :label="langStore.getText('endDate')"
                      outlined
                      type="date"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Questions Section -->
          <q-card class="create-exam__card q-mt-md">
            <q-card-section>
              <div class="row items-center justify-between">
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
              <div v-if="examForm.questions.length === 0" class="text-center q-pa-lg">
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

              <div v-else class="q-gutter-md">
                <div
                  v-for="(question, index) in examForm.questions"
                  :key="index"
                  class="create-exam__question"
                >
                  <q-card outlined>
                    <q-card-section>
                      <div class="row items-center justify-between">
                        <div class="text-subtitle1">{{ langStore.getText('question') }} {{ index + 1 }}</div>
                        <div class="row q-gutter-sm">
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
                      />

                      <div class="q-mt-md">
                        <div class="text-subtitle2 q-mb-sm">{{ langStore.getText('options') }}</div>
                        <div class="q-gutter-sm">
                          <div
                            v-for="(option, optionIndex) in question.options"
                            :key="optionIndex"
                            class="row items-center q-gutter-sm"
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
                              class="col"
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
        <div class="col-md-4">
          <q-card class="create-exam__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('examSettings') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="q-gutter-md">
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
          <q-card class="create-exam__card q-mt-md">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('examPreview') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="q-gutter-sm">
                <div class="row items-center justify-between">
                  <span class="text-caption">{{ langStore.getText('questions') }}</span>
                  <q-chip color="primary" text-color="white" size="sm">
                    {{ examForm.questions.length }}
                  </q-chip>
                </div>
                <div class="row items-center justify-between">
                  <span class="text-caption">{{ langStore.getText('duration') }}</span>
                  <span class="text-caption">{{ examForm.duration }} {{ langStore.getText('minutes') }}</span>
                </div>
                <div class="row items-center justify-between">
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'

const langStore = useLanguageStore()
const $q = useQuasar()

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
  difficulty: string
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
const difficultyOptions = [
  { label: 'سهل', value: 'easy' },
  { label: 'متوسط', value: 'medium' },
  { label: 'صعب', value: 'hard' }
]

const attemptsOptions = [
  { label: 'محاولة واحدة', value: 1 },
  { label: 'محاولتان', value: 2 },
  { label: '3 محاولات', value: 3 },
  { label: 'غير محدود', value: -1 }
]

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
    message: `تعديل السؤال ${index + 1}`
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

function saveDraft() {
  if (!examForm.value.title) {
    $q.notify({
      type: 'negative',
      message: langStore.getText('titleRequired')
    })
    return
  }

  $q.notify({
    type: 'positive',
    message: langStore.getText('draftSaved')
  })
}

function publishExam() {
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

  $q.notify({
    type: 'positive',
    message: langStore.getText('examPublished')
  })
}
</script>

<style lang="scss" scoped>
.create-exam {
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

  &__card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
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
}
</style>
