<template>
  <div class="login">
    <div class="login__container">
      <!-- Form Section -->
      <div class="login__form-section">
        <div class="login__logo">
          <q-icon name="school" size="2rem" />
        </div>

        <h1 class="login__title">{{ langStore.getText('welcomeBack') }}</h1>
        <p class="login__subtitle">{{ langStore.getText('loginSubtitle') }}</p>

        <form class="login__form" @submit.prevent="handleLogin">
          <!-- Error Message -->
          <div v-if="authStore.error" class="login__error">
            {{ authStore.error }}
          </div>

          <!-- Email Field -->
          <q-input
            v-model="email"
            type="email"
            :label="langStore.getText('email') + ' *'"
            :placeholder="langStore.getText('email')"
            class="login__field"
            outlined
            :rules="[val => !!val || langStore.getText('emailRequired')]"
            :disable="authStore.loading"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <!-- Password Field -->
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :label="langStore.getText('password') + ' *'"
            :placeholder="langStore.getText('password')"
            class="login__field"
            outlined
            :rules="[val => !!val || langStore.getText('passwordRequired')]"
            :disable="authStore.loading"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- Remember Me & Forgot Password -->
          <div class="login__options">
            <label class="login__checkbox">
              <q-checkbox v-model="rememberMe" />
              {{ langStore.getText('rememberMe') }}
            </label>
            <a href="#" class="login__forgot-link">{{ langStore.getText('forgotPassword') }}</a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="login__submit-btn"
            :disabled="authStore.loading"
          >
            <div v-if="authStore.loading" class="login__loading">
              <q-spinner size="1rem" />
              {{ langStore.getText('login') }}...
            </div>
            <span v-else>{{ langStore.getText('login') }}</span>
          </button>

          <!-- Divider -->
          <div class="login__divider">
            <span>{{ langStore.getText('loginWith') }}</span>
          </div>

          <!-- Google Login -->
          <button
            type="button"
            class="login__google-btn"
            @click="handleGoogleLogin"
            :disabled="authStore.loading"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
            {{ langStore.getText('googleLogin') }}
          </button>

          <!-- Register Link -->
          <div class="login__register">
            {{ langStore.getText('noAccount') }} <a href="#" @click.prevent="showRegister = true">{{ langStore.getText('registerHere') }}</a>
          </div>
        </form>
      </div>

      <!-- Image Section -->
      <div class="login__image-section">
        <img src="/login.jpg" alt="Arabic Learning" class="login__image" />
      </div>
    </div>

    <!-- Register Dialog -->
    <q-dialog v-model="showRegister">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ langStore.getText('createAccount') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleRegister" class="q-gutter-md">
            <q-input
              v-model="registerForm.name"
              :label="langStore.getText('fullName') + ' *'"
              outlined
              :rules="[val => !!val || langStore.getText('nameRequired')]"
            />

            <q-input
              v-model="registerForm.email"
              type="email"
              :label="langStore.getText('email') + ' *'"
              outlined
              :rules="[val => !!val || langStore.getText('emailRequired')]"
            />

            <q-input
              v-model="registerForm.password"
              :type="showRegisterPassword ? 'text' : 'password'"
              :label="langStore.getText('password') + ' *'"
              outlined
              :rules="[val => !!val || langStore.getText('passwordRequired')]"
            >
              <template v-slot:append>
                <q-icon
                  :name="showRegisterPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showRegisterPassword = !showRegisterPassword"
                />
              </template>
            </q-input>

            <div class="row q-gutter-sm">
              <q-btn
                :label="langStore.getText('cancel')"
                color="grey"
                flat
                v-close-popup
              />
              <q-btn
                :label="langStore.getText('createAccount')"
                type="submit"
                color="primary"
                :loading="authStore.loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const langStore = useLanguageStore()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

// Register dialog
const showRegister = ref(false)
const showRegisterPassword = ref(false)
const registerForm = ref({
  name: '',
  email: '',
  password: ''
})

// Check if user is already authenticated
onMounted(async () => {
  await authStore.getCurrentUser()
  if (authStore.isAuthenticated) {
    void router.push('/dashboard')
  }
})

async function handleLogin() {
  if (!email.value || !password.value) {
    $q.notify({
      type: 'negative',
      message: langStore.getText('fillAllFields')
    })
    return
  }

  const result = await authStore.signIn(email.value, password.value)

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: langStore.getText('loginSuccess')
    })
    void router.push('/dashboard')
  }
}

async function handleRegister() {
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    $q.notify({
      type: 'negative',
      message: langStore.getText('fillAllFieldsRequired')
    })
    return
  }

  const result = await authStore.signUp(
    registerForm.value.email,
    registerForm.value.password,
    registerForm.value.name
  )

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: langStore.getText('createAccountSuccess')
    })
    showRegister.value = false
    registerForm.value = { name: '', email: '', password: '' }
  }
}

function handleGoogleLogin() {
  $q.notify({
    type: 'info',
    message: langStore.getText('googleLoginComingSoon')
  })
}
</script>

<style lang="scss" scoped>
// Styles are imported from login.scss
</style>
