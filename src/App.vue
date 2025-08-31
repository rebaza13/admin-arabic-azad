<template>
  <div v-if="!authStore.initialized" class="auth-loading">
    <q-spinner-dots size="4rem" color="primary" />
    <p class="q-mt-md text-grey-7">{{ langStore.getText('loading') }}...</p>
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth-store'
import { useLanguageStore } from './stores/language-store'

const authStore = useAuthStore()
const langStore = useLanguageStore()

onMounted(async () => {
  await authStore.getCurrentUser()
})
</script>

<style lang="scss" scoped>
.auth-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;

  p {
    font-size: 1.1rem;
    font-family: 'Noto Sans Arabic', 'Noto Sans Kurdish', sans-serif;
  }
}
</style>
