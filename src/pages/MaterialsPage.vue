<template>
  <q-page class="q-pa-md">
    <div class="materials">
      <!-- Header -->
      <div class="materials__header">
        <div class="row items-center justify-between">
          <div>
            <h1 class="materials__title">{{ langStore.getText('teachingMaterials') }}</h1>
            <p class="materials__subtitle">{{ langStore.getText('manageTeachingMaterials') }}</p>
          </div>
          <q-btn
            color="primary"
            icon="add"
            :label="langStore.getText('addMaterial')"
            @click="$router.push('/materials/upload')"
          />
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="materials__filters q-mb-md">
        <div class="row q-gutter-md">
          <div class="col-md-4">
            <q-input
              v-model="searchQuery"
              :placeholder="langStore.getText('searchMaterials')"
              outlined
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-md-3">
            <q-select
              v-model="categoryFilter"
              :options="categoryOptions"
              :label="langStore.getText('category')"
              outlined
              dense
              clearable
            />
          </div>
          <div class="col-md-3">
            <q-select
              v-model="typeFilter"
              :options="typeOptions"
              :label="langStore.getText('fileType')"
              outlined
              dense
              clearable
            />
          </div>
        </div>
      </div>

      <!-- Materials Grid -->
      <div v-if="loading" class="materials__loading">
        <q-spinner-dots size="3rem" color="primary" />
        <p class="q-mt-md">{{ langStore.getText('loading') }}...</p>
      </div>

      <div v-else-if="filteredMaterials.length === 0" class="materials__empty">
        <q-icon name="folder_open" size="5rem" color="grey-4" />
        <h3 class="q-mt-md">{{ langStore.getText('noMaterials') }}</h3>
        <p class="text-grey-6">{{ langStore.getText('noMaterialsDescription') }}</p>
        <q-btn
          color="primary"
          icon="add"
          :label="langStore.getText('addFirstMaterial')"
          @click="$router.push('/materials/upload')"
          class="q-mt-md"
        />
      </div>

      <div v-else class="materials__grid">
        <div class="row q-gutter-md">
          <div
            v-for="material in filteredMaterials"
            :key="material.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="materials__card">
              <!-- Material Preview -->
              <div class="materials__preview">
                <div v-if="material.file_type === 'pdf'" class="materials__preview-pdf">
                  <q-icon name="picture_as_pdf" size="4rem" color="red" />
                  <span class="text-caption">{{ langStore.getText('pdfDocument') }}</span>
                </div>
                <div v-else-if="material.file_type === 'image'" class="materials__preview-image">
                  <q-img
                    :src="material.file_url"
                    :ratio="16/9"
                    spinner-color="primary"
                    spinner-size="2rem"
                  />
                </div>
                <div v-else-if="material.youtube_link" class="materials__preview-video">
                  <q-icon name="play_circle" size="4rem" color="red" />
                  <span class="text-caption">{{ langStore.getText('videoContent') }}</span>
                </div>
                <div v-else class="materials__preview-default">
                  <q-icon name="description" size="4rem" color="grey" />
                  <span class="text-caption">{{ langStore.getText('document') }}</span>
                </div>
              </div>

              <!-- Material Info -->
              <q-card-section>
                <div class="text-h6 materials__title">{{ material.title }}</div>
                <div v-if="material.section_name" class="text-caption text-primary q-mb-sm">
                  {{ material.section_name }}
                </div>
                <p v-if="material.description" class="materials__description">
                  {{ material.description }}
                </p>

                <!-- Tags -->
                <div v-if="material.tags && material.tags.length > 0" class="materials__tags q-mt-sm">
                  <q-chip
                    v-for="tag in material.tags.slice(0, 3)"
                    :key="tag"
                    size="sm"
                    color="primary"
                    text-color="white"
                    :label="tag"
                  />
                  <q-chip
                    v-if="material.tags.length > 3"
                    size="sm"
                    color="grey"
                    text-color="white"
                    :label="`+${material.tags.length - 3}`"
                  />
                </div>

                <!-- Stats -->
                <div class="materials__stats q-mt-md">
                  <div class="row items-center justify-between">
                    <div class="text-caption text-grey-6">
                      <q-icon name="download" size="1rem" />
                      {{ material.download_count }}
                    </div>
                    <div class="text-caption text-grey-6">
                      {{ formatDate(material.created_at) }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <!-- Actions -->
              <q-card-actions align="right">
                <q-btn-dropdown flat round icon="more_vert" size="sm">
                  <q-list>
                    <q-item clickable v-close-popup @click="viewMaterial(material)">
                      <q-item-section avatar>
                        <q-icon name="visibility" />
                      </q-item-section>
                      <q-item-section>{{ langStore.getText('view') }}</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="downloadMaterial(material)">
                      <q-item-section avatar>
                        <q-icon name="download" />
                      </q-item-section>
                      <q-item-section>{{ langStore.getText('download') }}</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="editMaterial(material)">
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>{{ langStore.getText('edit') }}</q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item clickable v-close-popup @click="deleteMaterial(material)">
                      <q-item-section avatar>
                        <q-icon name="delete" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative">{{ langStore.getText('delete') }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <!-- View Material Dialog -->
      <q-dialog v-model="showViewDialog" maximized>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">{{ selectedMaterial?.title }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section v-if="selectedMaterial">
            <div class="row q-gutter-lg">
              <div class="col-12 col-md-8">
                <!-- Content Preview -->
                <div v-if="selectedMaterial.file_type === 'image'" class="materials__view-image">
                  <q-img
                    :src="selectedMaterial.file_url"
                    :ratio="16/9"
                    spinner-color="primary"
                    spinner-size="2rem"
                  />
                </div>

                <div v-else-if="selectedMaterial.youtube_link" class="materials__view-video">
                  <iframe
                    :src="getYouTubeEmbedUrl(selectedMaterial.youtube_link)"
                    width="100%"
                    height="400"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>

                <div v-else-if="selectedMaterial.file_type === 'pdf'" class="materials__view-pdf">
                  <iframe
                    :src="selectedMaterial.file_url || ''"
                    width="100%"
                    height="600"
                    frameborder="0"
                  ></iframe>
                </div>

                <div v-else class="materials__view-default">
                  <q-icon name="description" size="5rem" color="grey" />
                  <p class="text-grey-6 q-mt-md">{{ langStore.getText('previewNotAvailable') }}</p>
                  <q-btn
                    color="primary"
                    icon="download"
                    :label="langStore.getText('downloadToView')"
                    @click="downloadMaterial(selectedMaterial)"
                  />
                </div>
              </div>

              <div class="col-12 col-md-4">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6">{{ langStore.getText('materialDetails') }}</div>

                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('title') }}</q-item-label>
                          <q-item-label>{{ selectedMaterial.title }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="selectedMaterial.section_name">
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('section') }}</q-item-label>
                          <q-item-label>{{ selectedMaterial.section_name }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="selectedMaterial.category">
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('category') }}</q-item-label>
                          <q-item-label>{{ selectedMaterial.category }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="selectedMaterial.file_type">
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('fileType') }}</q-item-label>
                          <q-item-label>{{ getFileTypeText(selectedMaterial.file_type) }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-if="selectedMaterial.file_size">
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('fileSize') }}</q-item-label>
                          <q-item-label>{{ formatFileSize(selectedMaterial.file_size) }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('downloads') }}</q-item-label>
                          <q-item-label>{{ selectedMaterial.download_count }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section>
                          <q-item-label caption>{{ langStore.getText('uploadDate') }}</q-item-label>
                          <q-item-label>{{ formatDate(selectedMaterial.created_at) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>

                    <q-separator class="q-my-md" />

                    <div v-if="selectedMaterial.description">
                      <div class="text-subtitle2 q-mb-sm">{{ langStore.getText('description') }}</div>
                      <p>{{ selectedMaterial.description }}</p>
                    </div>

                    <div v-if="selectedMaterial.tags && selectedMaterial.tags.length > 0" class="q-mt-md">
                      <div class="text-subtitle2 q-mb-sm">{{ langStore.getText('tags') }}</div>
                      <div class="q-gutter-sm">
                        <q-chip
                          v-for="tag in selectedMaterial.tags"
                          :key="tag"
                          size="sm"
                          color="primary"
                          text-color="white"
                          :label="tag"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'
import { DatabaseService, type Material } from '../lib/database'

const langStore = useLanguageStore()
const $q = useQuasar()

// Reactive data
const loading = ref(false)
const materials = ref<Material[]>([])
const showViewDialog = ref(false)
const selectedMaterial = ref<Material | null>(null)
const searchQuery = ref('')
const categoryFilter = ref('')
const typeFilter = ref('')

// Computed
const filteredMaterials = computed(() => {
  let filtered = materials.value

  if (searchQuery.value) {
    filtered = filtered.filter(material =>
      material.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      material.section_name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(material => material.category === categoryFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(material => material.file_type === typeFilter.value)
  }

  return filtered
})

const categoryOptions = computed(() => {
  const categories = [...new Set(materials.value.map(m => m.category).filter(Boolean))]
  return categories.map(cat => ({ label: cat, value: cat }))
})

const typeOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'صورة', value: 'image' },
  { label: 'فيديو', value: 'video' },
  { label: 'مستند', value: 'document' },
  { label: 'صوت', value: 'audio' }
]

// Methods
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileTypeText(fileType: string): string {
  const types: Record<string, string> = {
    pdf: 'PDF',
    image: 'صورة',
    video: 'فيديو',
    document: 'مستند',
    audio: 'صوت'
  }
  return types[fileType] || fileType
}

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

async function loadMaterials() {
  try {
    loading.value = true
    materials.value = await DatabaseService.getMaterials()
  } catch (error) {
    console.error('Error loading materials:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorLoadingMaterials') || 'حدث خطأ في تحميل المواد'
    })
  } finally {
    loading.value = false
  }
}

function viewMaterial(material: Material) {
  selectedMaterial.value = material
  showViewDialog.value = true
}

function downloadMaterial(material: Material) {
  if (material.file_url) {
    const link = document.createElement('a')
    link.href = material.file_url
    link.download = material.title
    link.click()
  } else if (material.youtube_link) {
    window.open(material.youtube_link, '_blank')
  }
}

function editMaterial(material: Material) {
  // TODO: Implement edit functionality
  $q.notify({
    type: 'info',
    message: `تعديل المادة: ${material.title}`
  })
}

function deleteMaterial(material: Material) {
  $q.dialog({
    title: langStore.getText('confirmDelete'),
    message: `${langStore.getText('deleteMaterialConfirm')} ${material.title}؟`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await DatabaseService.deleteMaterial(material.id)
        materials.value = materials.value.filter(m => m.id !== material.id)
        $q.notify({
          type: 'positive',
          message: langStore.getText('materialDeleted') || 'تم حذف المادة بنجاح'
        })
      } catch (error) {
        console.error('Error deleting material:', error)
        $q.notify({
          type: 'negative',
          message: langStore.getText('errorDeletingMaterial') || 'حدث خطأ في حذف المادة'
        })
      }
    })()
  })
}

onMounted(async () => {
  await loadMaterials()
})
</script>

<style lang="scss" scoped>
.materials {
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

  &__filters {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

  &__grid {
    margin-top: 2rem;
  }

  &__card {
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
  }

  &__preview {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border-radius: 12px 12px 0 0;
    flex-direction: column;
  }

  &__preview-pdf,
  &__preview-video,
  &__preview-default {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  &__preview-image {
    height: 100%;
    width: 100%;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  &__description {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0.5rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  &__stats {
    border-top: 1px solid #e2e8f0;
    padding-top: 0.75rem;
  }

  &__view-image,
  &__view-video,
  &__view-pdf {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }

  &__view-default {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    background: #f8fafc;
    border-radius: 8px;
  }
}
</style>
