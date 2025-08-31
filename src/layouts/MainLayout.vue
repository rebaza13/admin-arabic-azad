<template>
  <q-layout view="hHr lpR fFf" dir="rtl">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-md"
        />

        <q-toolbar-title class="text-center">
          <div class="row items-center justify-center">
            <q-icon name="school" size="2rem" class="q-mr-md" />
            <span class="text-h6 font-weight-bold">
              {{ langStore.currentLanguage === 'ar' ? 'تعلم العربية مع أزاد' : 'فێربوونی عەرەبی لەگەڵ ئازاد' }}
            </span>
          </div>
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <!-- Language Dropdown -->
          <q-btn-dropdown
            flat
            color="white"
            :label="langStore.currentLanguage === 'ar' ? 'عربي' : 'کوردی'"
            icon="language"
            class="q-mr-sm"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="langStore.setLanguage('ar')"
                :active="langStore.currentLanguage === 'ar'"
              >
                <q-item-section avatar>
                  <q-icon name="flag" />
                </q-item-section>
                <q-item-section>عربي</q-item-section>
                <q-item-section side v-if="langStore.currentLanguage === 'ar'">
                  <q-icon name="check" color="primary" />
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="langStore.setLanguage('ckb')"
                :active="langStore.currentLanguage === 'ckb'"
              >
                <q-item-section avatar>
                  <q-icon name="flag" />
                </q-item-section>
                <q-item-section>کوردی</q-item-section>
                <q-item-section side v-if="langStore.currentLanguage === 'ckb'">
                  <q-icon name="check" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <!-- User Menu -->
          <q-btn-dropdown flat color="white" icon="account_circle">
            <q-list>
              <q-item clickable v-close-popup @click="showProfile = true">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>{{ langStore.getText('profile') }}</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>{{ langStore.getText('logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      side="right"
      class="bg-grey-1"
      :width="300"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary">
            <div class="text-h6">{{ langStore.getText('mainMenu') }}</div>
          </q-item-label>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/dashboard'"
            @click="$router.push('/dashboard')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('dashboard') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-weight-bold text-secondary">
            <div class="text-subtitle1">{{ langStore.getText('studentManagement') }}</div>
          </q-item-label>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/students'"
            @click="$router.push('/students')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="people" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('students') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/students/pending'"
            @click="$router.push('/students/pending')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="pending" color="warning" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('registrationRequests') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-weight-bold text-accent">
            <div class="text-subtitle1">{{ langStore.getText('examManagement') }}</div>
          </q-item-label>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/exams'"
            @click="$router.push('/exams')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="quiz" color="accent" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('exams') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/exams/create'"
            @click="$router.push('/exams/create')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="add_circle" color="positive" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('createExam') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/exams/results'"
            @click="$router.push('/exams/results')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="assessment" color="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('examResults') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-weight-bold text-teal">
            <div class="text-subtitle1">{{ langStore.getText('materials') }}</div>
          </q-item-label>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/materials'"
            @click="$router.push('/materials')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="library_books" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('materials') }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="$route.path === '/materials/upload'"
            @click="$router.push('/materials/upload')"
            class="q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="upload_file" color="orange" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ langStore.getText('uploadMaterials') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Profile Dialog -->
    <q-dialog v-model="showProfile">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ langStore.getText('profile') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body2">
            <p><strong>{{ langStore.getText('email') }}:</strong> {{ authStore.user?.email }}</p>
            <p><strong>{{ langStore.getText('role') }}:</strong> {{ authStore.user?.user_metadata?.role || 'admin' }}</p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const langStore = useLanguageStore()
const $q = useQuasar()

const leftDrawerOpen = ref(false)
const showProfile = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function handleLogout() {
  try {
    await authStore.signOut()
    await router.push('/login')
    $q.notify({
      type: 'positive',
      message: langStore.getText('logoutSuccess'),
      position: 'top'
    })
  } catch (error) {
    console.error('Logout error:', error)
    $q.notify({
      type: 'negative',
      message: 'حدث خطأ في تسجيل الخروج',
      position: 'top'
    })
  }
}
</script>

<style lang="scss" scoped>
.q-layout {
  .q-header {
    .q-toolbar {
      .q-toolbar__title {
        .text-h6 {
          font-family: 'Noto Sans Arabic', 'Noto Sans Kurdish', sans-serif;
        }
      }
    }
  }

  .q-drawer {
    .q-list {
      .q-item {
        border-radius: 8px;
        margin: 0 8px;

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        &.q-item--active {
          background-color: var(--q-primary);
          color: white;

          .q-icon {
            color: white !important;
          }
        }
      }

      .q-item-label {
        padding: 16px 16px 8px 16px;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }
}

// RTL specific styles
[dir="rtl"] {
  .q-header {
    .q-toolbar {
      .q-btn {
        margin-right: 0;
        margin-left: 16px;
      }
    }
  }

  .q-drawer {
    .q-list {
      .q-item {
        .q-item__section--avatar {
          margin-right: 0;
          margin-left: 12px;
        }
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .q-header {
    .q-toolbar {
      .q-toolbar__title {
        .text-h6 {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
