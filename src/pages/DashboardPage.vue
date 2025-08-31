<template>
  <q-page class="q-pa-md">
    <div class="dashboard">
      <!-- Header -->
      <div class="dashboard__header">
        <h1 class="dashboard__title">{{ langStore.getText('dashboard') }}</h1>
        <p class="dashboard__subtitle">{{ langStore.getText('welcomeToDashboard') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="dashboard__loading">
        <q-spinner-dots size="3rem" color="primary" />
        <p class="q-mt-md">{{ langStore.getText('loading') }}...</p>
      </div>

      <!-- Statistics Cards -->
      <div v-else class="dashboard__stats">
        <div class="row q-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="people" size="2.5rem" color="primary" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.totalStudents }}</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('totalStudents') }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="quiz" size="2.5rem" color="secondary" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.totalExams }}</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('totalExams') }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="pending" size="2.5rem" color="warning" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.pendingStudents }}</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('pendingRequests') }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="library_books" size="2.5rem" color="accent" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.totalMaterials }}</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('teachingMaterials') }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Additional Stats Row -->
        <div class="row q-gutter-md q-mt-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="play_circle" size="2.5rem" color="positive" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.activeExams }}</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('activeExams') }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="check_circle" size="2.5rem" color="info" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.completedExams }}</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('completedExams') }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="analytics" size="2.5rem" color="teal" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.averageScore }}%</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('averageScore') }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="dashboard__stat-card" flat bordered>
              <q-card-section class="text-center">
                <q-icon name="trending_up" size="2.5rem" color="orange" />
                <div class="text-h4 q-mt-sm text-weight-bold">{{ todayRegistrations }}</div>
                <div class="text-subtitle2 text-grey-7">{{ langStore.getText('todayRegistrations') }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="row q-gutter-md q-mt-lg">
        <div class="col-12 col-lg-8">
          <q-card class="dashboard__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('recentActivity') }}</div>
            </q-card-section>

            <q-card-section>
              <div v-if="recentActivity.length === 0" class="text-center q-pa-md">
                <q-icon name="info" size="3rem" color="grey-4" />
                <p class="q-mt-md text-grey-6">{{ langStore.getText('noRecentActivity') }}</p>
              </div>

              <q-list v-else>
                <q-item v-for="activity in recentActivity" :key="activity.id">
                  <q-item-section avatar>
                    <q-icon :name="getActivityIcon(activity.action_type)" :color="getActivityColor(activity.action_type)" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ activity.description }}</q-item-label>
                    <q-item-label caption>{{ formatTimeAgo(activity.created_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-lg-4">
          <q-card class="dashboard__card">
            <q-card-section>
              <div class="text-h6">{{ langStore.getText('quickActions') }}</div>
            </q-card-section>

            <q-card-section>
              <div class="q-gutter-y-md">
                <q-btn
                  color="primary"
                  icon="add_circle"
                  :label="langStore.getText('createNewExam')"
                  class="full-width"
                  @click="$router.push('/exams/create')"
                />

                <q-btn
                  color="secondary"
                  icon="cloud_upload"
                  :label="langStore.getText('uploadTeachingMaterials')"
                  class="full-width"
                  @click="$router.push('/materials/upload')"
                />

                <q-btn
                  color="accent"
                  icon="people"
                  :label="langStore.getText('reviewRegistrationRequests')"
                  class="full-width"
                  @click="$router.push('/students/pending')"
                />

                <q-btn
                  color="info"
                  icon="analytics"
                  :label="langStore.getText('viewReports')"
                  class="full-width"
                  @click="$router.push('/exams/results')"
                />

                <q-btn
                  color="positive"
                  icon="add"
                  :label="langStore.getText('addNewStudent')"
                  class="full-width"
                  @click="$router.push('/students')"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Quick Actions -->
        <div class="row q-mt-xl">
          <div class="col-12">
            <h2 class="text-h5 q-mb-md">{{ langStore.getText('quickActions') }}</h2>
            <div class="row q-gutter-md">
              <div class="col-12 col-sm-6 col-md-3">
                <q-card
                  class="dashboard__action-card cursor-pointer"
                  flat
                  bordered
                  @click="$router.push('/exams/create')"
                >
                  <q-card-section class="text-center">
                    <q-icon name="add_circle" size="3rem" color="primary" />
                    <div class="text-h6 q-mt-sm">{{ langStore.getText('createNewExam') }}</div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-card
                  class="dashboard__action-card cursor-pointer"
                  flat
                  bordered
                  @click="$router.push('/materials/upload')"
                >
                  <q-card-section class="text-center">
                    <q-icon name="upload_file" size="3rem" color="secondary" />
                    <div class="text-h6 q-mt-sm">{{ langStore.getText('uploadTeachingMaterials') }}</div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-card
                  class="dashboard__action-card cursor-pointer"
                  flat
                  bordered
                  @click="$router.push('/students/pending')"
                >
                  <q-card-section class="text-center">
                    <q-icon name="pending_actions" size="3rem" color="warning" />
                    <div class="text-h6 q-mt-sm">{{ langStore.getText('reviewRegistrationRequests') }}</div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-12 col-sm-6 col-md-3">
                <q-card
                  class="dashboard__action-card cursor-pointer"
                  flat
                  bordered
                  @click="$router.push('/exams/results')"
                >
                  <q-card-section class="text-center">
                    <q-icon name="assessment" size="3rem" color="info" />
                    <div class="text-h6 q-mt-sm">{{ langStore.getText('viewReports') }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="row q-mt-xl">
          <div class="col-12">
            <h2 class="text-h5 q-mb-md">{{ langStore.getText('recentActivity') }}</h2>
            <q-card flat bordered>
              <q-card-section>
                <div v-if="recentActivity.length === 0" class="text-center q-pa-lg">
                  <q-icon name="info" size="3rem" color="grey-5" />
                  <div class="text-grey-6 q-mt-sm">{{ langStore.getText('noRecentActivity') }}</div>
                </div>
                <div v-else>
                  <div
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    class="activity-item q-py-sm"
                  >
                    <div class="row items-center">
                      <div class="col-auto">
                        <q-avatar
                          :color="getActivityColor(activity.action_type)"
                          text-color="white"
                          size="2rem"
                        >
                          <q-icon :name="getActivityIcon(activity.action_type)" size="1rem" />
                        </q-avatar>
                      </div>
                      <div class="col">
                        <div class="text-body2">{{ activity.description }}</div>
                        <div class="text-caption text-grey-6">{{ formatTimeAgo(activity.created_at) }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { DatabaseService, type ActivityLog } from '../lib/database'

const langStore = useLanguageStore()

// Reactive data
const loading = ref(true)
const stats = ref({
  totalStudents: 0,
  totalExams: 0,
  pendingStudents: 0,
  totalMaterials: 0,
  activeExams: 0,
  completedExams: 0,
  averageScore: 0
})
const recentActivity = ref<ActivityLog[]>([])

// Computed
const todayRegistrations = computed(() => {
  // This would be calculated from the database
  return Math.floor(Math.random() * 10) + 1
})

// Methods
async function loadDashboardData() {
  try {
    loading.value = true

    // Load dashboard statistics
    const dashboardStats = await DatabaseService.getDashboardStats()
    stats.value = dashboardStats

    // Load recent activity
    const activity = await DatabaseService.getRecentActivity(10)
    recentActivity.value = activity
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Set default values if database is not available
    stats.value = {
      totalStudents: 25,
      totalExams: 8,
      pendingStudents: 3,
      totalMaterials: 15,
      activeExams: 2,
      completedExams: 6,
      averageScore: 78
    }
    // Add dummy activity data based on current language
    const activityDescriptions = {
      ar: {
        student_registered: 'طالب جديد انضم إلى النظام',
        exam_created: 'تم إنشاء اختبار جديد',
        material_uploaded: 'تم رفع مادة تعليمية جديدة'
      },
      ckb: {
        student_registered: 'قوتابیەکی نوێ پەیوەندی بە سیستەمەکەوە کرد',
        exam_created: 'تاقیکردنەوەیەکی نوێ دروست کراوە',
        material_uploaded: 'ماددەیەکی فێرکاری نوێ بار کراوە'
      }
    }

    const lang = langStore.currentLanguage
    const descriptions = activityDescriptions[lang]

    recentActivity.value = [
      {
        id: '1',
        action_type: 'student_registered',
        description: descriptions.student_registered,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        action_type: 'exam_created',
        description: descriptions.exam_created,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        action_type: 'material_uploaded',
        description: descriptions.material_uploaded,
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

function getActivityIcon(actionType: string): string {
  const icons: Record<string, string> = {
    student_registered: 'person_add',
    exam_created: 'quiz',
    material_uploaded: 'cloud_upload',
    exam_completed: 'check_circle',
    student_approved: 'verified',
    student_rejected: 'cancel',
    exam_published: 'publish',
    material_deleted: 'delete'
  }
  return icons[actionType] || 'info'
}

function getActivityColor(actionType: string): string {
  const colors: Record<string, string> = {
    student_registered: 'positive',
    exam_created: 'primary',
    material_uploaded: 'accent',
    exam_completed: 'secondary',
    student_approved: 'positive',
    student_rejected: 'negative',
    exam_published: 'info',
    material_deleted: 'negative'
  }
  return colors[actionType] || 'grey'
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return langStore.getText('justNow') || 'الآن'
  if (diffInMinutes < 60) return `${diffInMinutes} ${langStore.getText('minutesAgo') || 'دقيقة'}`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} ${langStore.getText('hoursAgo') || 'ساعة'}`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ${langStore.getText('daysAgo') || 'يوم'}`

  return date.toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await loadDashboardData()
})
</script>

<style lang="scss" scoped>
.dashboard {
  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: #64748b;
    margin: 0;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: #64748b;
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

  &__card {
    height: 100%;
  }

  &__action-card {
    transition: all 0.3s ease;
    border-radius: 12px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background-color: var(--q-grey-1);
    }

    .q-card__section {
      padding: 1.5rem;
    }
  }
}

.activity-item {
  border-bottom: 1px solid var(--q-grey-3);

  &:last-child {
    border-bottom: none;
  }

  .row {
    gap: 0.75rem;
  }
}

// RTL Support
[dir="rtl"] {
  .dashboard__header {
    .dashboard__title {
      font-family: 'Noto Sans Arabic', sans-serif;
    }
  }
}
</style>
