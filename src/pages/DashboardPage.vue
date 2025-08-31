<template>
  <q-page class="dashboard-page">
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
        <div class="dashboard__stats-grid">
          <q-card class="dashboard__stat-card" flat bordered>
            <q-card-section class="text-center">
              <q-icon name="people" size="2.5rem" color="primary" />
              <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.totalStudents }}</div>
              <div class="text-subtitle2 text-grey-7">{{ langStore.getText('totalStudents') }}</div>
            </q-card-section>
          </q-card>

          <q-card class="dashboard__stat-card" flat bordered>
            <q-card-section class="text-center">
              <q-icon name="quiz" size="2.5rem" color="secondary" />
              <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.totalExams }}</div>
              <div class="text-subtitle2 text-grey-7">{{ langStore.getText('totalExams') }}</div>
            </q-card-section>
          </q-card>

          <q-card class="dashboard__stat-card" flat bordered>
            <q-card-section class="text-center">
              <q-icon name="pending" size="2.5rem" color="warning" />
              <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.pendingStudents }}</div>
              <div class="text-subtitle2 text-grey-7">{{ langStore.getText('pendingRequests') }}</div>
            </q-card-section>
          </q-card>

          <q-card class="dashboard__stat-card" flat bordered>
            <q-card-section class="text-center">
              <q-icon name="library_books" size="2.5rem" color="accent" />
              <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.totalMaterials }}</div>
              <div class="text-subtitle2 text-grey-7">{{ langStore.getText('teachingMaterials') }}</div>
            </q-card-section>
          </q-card>

          <q-card class="dashboard__stat-card" flat bordered>
            <q-card-section class="text-center">
              <q-icon name="play_circle" size="2.5rem" color="positive" />
              <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.activeExams }}</div>
              <div class="text-subtitle2 text-grey-7">{{ langStore.getText('activeExams') }}</div>
            </q-card-section>
          </q-card>

          <q-card class="dashboard__stat-card" flat bordered>
            <q-card-section class="text-center">
              <q-icon name="check_circle" size="2.5rem" color="info" />
              <div class="text-h4 q-mt-sm text-weight-bold">{{ stats.completedExams }}</div>
              <div class="text-subtitle2 text-grey-7">{{ langStore.getText('completedExams') }}</div>
            </q-card-section>
          </q-card>

          <q-card class="dashboard__stat-card" flat bordered>
            <q-card-section class="text-center">
              <q-icon name="trending_up" size="2.5rem" color="orange" />
              <div class="text-h4 q-mt-sm text-weight-bold">{{ todayRegistrations }}</div>
              <div class="text-subtitle2 text-grey-7">{{ langStore.getText('todayRegistrations') }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="dashboard__content">
        <!-- Database Test Section -->
        <div class="dashboard__db-test q-mb-lg">
          <q-card class="dashboard__card">
            <q-card-section>
              <div class="text-h6">Database Test</div>
            </q-card-section>
            <q-card-section>
              <q-btn 
                color="info" 
                @click="testDatabase" 
                :loading="testingDB"
                label="Test Database Connection"
              />
              <div v-if="dbTestResult" class="q-mt-md">
                <q-chip :color="dbTestResult.success ? 'positive' : 'negative'" text-color="white">
                  {{ dbTestResult.message }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>
        
        <!-- Recent Activity - Takes more space -->
        <div class="dashboard__activity-section">
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

        <!-- Quick Actions - Compact sidebar -->
        <div class="dashboard__actions-section">
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
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { DatabaseService, type ActivityLog } from '../lib/database'
import { testDatabaseConnection, checkTablesExist } from '../lib/test-db'

const langStore = useLanguageStore()

// Reactive data
const loading = ref(true)
const testingDB = ref(false)
const dbTestResult = ref<{success: boolean, message: string} | null>(null)
const stats = ref({
  totalStudents: 0,
  totalExams: 0,
  pendingStudents: 0,
  totalMaterials: 0,
  activeExams: 0,
  completedExams: 0
})
const recentActivity = ref<ActivityLog[]>([])

// Computed
const todayRegistrations = computed(() => {
  // This would be calculated from the database
  return Math.floor(Math.random() * 10) + 1
})

// Methods
async function testDatabase() {
  try {
    testingDB.value = true
    dbTestResult.value = null
    
    const connectionOk = await testDatabaseConnection()
    if (!connectionOk) {
      dbTestResult.value = {
        success: false,
        message: 'Database connection failed'
      }
      return
    }
    
    const tablesOk = await checkTablesExist()
    if (!tablesOk) {
      dbTestResult.value = {
        success: false,
        message: 'Some database tables are missing'
      }
      return
    }
    
    dbTestResult.value = {
      success: true,
      message: 'Database connection and tables OK'
    }
  } catch (error) {
    dbTestResult.value = {
      success: false,
      message: 'Database test error: ' + (error as Error).message
    }
  } finally {
    testingDB.value = false
  }
}

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
      completedExams: 6
    }
    // Add dummy activity data based on current language
    const activityDescriptions = {
      ar: {
        student_registered: 'طالب جديد انضم إلى النظام: أحمد محمد علي',
        exam_created: 'تم إنشاء اختبار جديد: اختبار النحو الأساسي',
        material_uploaded: 'تم رفع مادة تعليمية جديدة: أساسيات النحو العربي',
        exam_completed: 'أحمد محمد علي أكمل اختبار النحو الأساسي بنتيجة 66.67%',
        student_approved: 'تم الموافقة على طلب الطالب: علي حسن محمد'
      },
      ckb: {
        student_registered: 'قوتابیەکی نوێ پەیوەندی بە سیستەمەکەوە کرد: ئەحمەد محەممەد عەلی',
        exam_created: 'تاقیکردنەوەیەکی نوێ دروست کراوە: تاقیکردنەوەی ڕێساکانی سەرەتایی',
        material_uploaded: 'ماددەیەکی فێرکاری نوێ بار کراوە: ڕێساکانی سەرەتایی ڕێزمانی عەرەبی',
        exam_completed: 'ئەحمەد محەممەد عەلی تاقیکردنەوەی ڕێساکانی سەرەتایی تەواو کرد بە نمرەی 66.67%',
        student_approved: 'داواکاری قوتابی پەسەند کراوە: عەلی حەسەن محەممەد'
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
        action_type: 'student_registered',
        description: descriptions.student_registered.replace('أحمد محمد علي', 'فاطمة أحمد حسن'),
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        action_type: 'exam_created',
        description: descriptions.exam_created,
        created_at: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '4',
        action_type: 'material_uploaded',
        description: descriptions.material_uploaded,
        created_at: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: '5',
        action_type: 'exam_completed',
        description: descriptions.exam_completed,
        created_at: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: '6',
        action_type: 'student_approved',
        description: descriptions.student_approved,
        created_at: new Date(Date.now() - 18000000).toISOString()
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
.dashboard-page {
  padding: 0 !important;
}

.dashboard {
  padding: 2rem;
  width: 100%;
  max-width: 100%;

  &__header {
    margin-bottom: 2.5rem;
    text-align: center;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.75rem 0;
  }

  &__subtitle {
    font-size: 1.2rem;
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
    margin-bottom: 3rem;
  }

  &__stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  &__stat-card {
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 12px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .q-card__section {
      padding: 1.5rem;
    }
  }

  &__content {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  &__activity-section {
    flex: 2;
    min-width: 0;
  }

  &__actions-section {
    flex: 1;
    min-width: 300px;
  }

  // Responsive design
  @media (max-width: 1024px) {
    &__content {
      flex-direction: column;
    }

    &__activity-section,
    &__actions-section {
      flex: none;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    &__stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    padding: 1rem;
  }

  &__card {
    height: 100%;
    border-radius: 12px;
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
