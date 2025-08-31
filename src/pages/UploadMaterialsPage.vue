<template>
  <q-page class="q-pa-md">
    <div class="upload-materials">
      <!-- Header -->
      <div class="upload-materials__header">
        <div class="row items-center justify-between">
          <div>
            <h1 class="upload-materials__title">{{ langStore.getText('uploadTeachingMaterials') }}</h1>
            <p class="upload-materials__subtitle">{{ langStore.getText('addNewTeachingMaterial') }}</p>
          </div>
          <q-btn
            color="secondary"
            icon="arrow_back"
            :label="langStore.getText('backToMaterials')"
            @click="$router.push('/materials')"
          />
        </div>
      </div>

      <!-- Upload Form -->
      <q-card class="upload-materials__form-card">
        <q-card-section>
          <div class="text-h6">{{ langStore.getText('materialInformation') }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="uploadMaterial" class="q-gutter-md">
            <!-- Basic Information -->
            <div class="row q-gutter-md">
              <div class="col-12 col-md-8">
                <q-input
                  v-model="materialForm.title"
                  :label="langStore.getText('title') + ' *'"
                  outlined
                  :rules="[val => !!val || langStore.getText('titleRequired')]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="materialForm.category"
                  :options="categoryOptions"
                  :label="langStore.getText('category')"
                  outlined
                />
              </div>
            </div>

            <div class="row q-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="materialForm.section_name"
                  :label="langStore.getText('sectionName')"
                  outlined
                  :hint="langStore.getText('sectionNameHint')"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="materialForm.tags"
                  :label="langStore.getText('tags')"
                  outlined
                  :hint="langStore.getText('tagsHint')"
                />
              </div>
            </div>

            <q-input
              v-model="materialForm.description"
              type="textarea"
              :label="langStore.getText('description')"
              outlined
              rows="3"
              :hint="langStore.getText('descriptionHint')"
            />

            <!-- Upload Type Selection -->
            <div class="upload-materials__type-selection">
              <div class="text-subtitle1 q-mb-md">{{ langStore.getText('uploadType') }}</div>
              <div class="row q-gutter-md">
                <div class="col-12 col-md-4">
                  <q-card
                    :class="['upload-materials__type-card', { 'upload-materials__type-card--selected': uploadType === 'file' }]"
                    clickable
                    @click="uploadType = 'file'"
                  >
                    <q-card-section class="text-center">
                      <q-icon name="cloud_upload" size="3rem" color="primary" />
                      <div class="text-h6 q-mt-sm">{{ langStore.getText('uploadFile') }}</div>
                      <div class="text-caption">{{ langStore.getText('uploadFileDescription') }}</div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-md-4">
                  <q-card
                    :class="['upload-materials__type-card', { 'upload-materials__type-card--selected': uploadType === 'youtube' }]"
                    clickable
                    @click="uploadType = 'youtube'"
                  >
                    <q-card-section class="text-center">
                      <q-icon name="play_circle" size="3rem" color="red" />
                      <div class="text-h6 q-mt-sm">{{ langStore.getText('youtubeLink') }}</div>
                      <div class="text-caption">{{ langStore.getText('youtubeLinkDescription') }}</div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class="col-12 col-md-4">
                  <q-card
                    :class="['upload-materials__type-card', { 'upload-materials__type-card--selected': uploadType === 'text' }]"
                    clickable
                    @click="uploadType = 'text'"
                  >
                    <q-card-section class="text-center">
                      <q-icon name="description" size="3rem" color="green" />
                      <div class="text-h6 q-mt-sm">{{ langStore.getText('textContent') }}</div>
                      <div class="text-caption">{{ langStore.getText('textContentDescription') }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- File Upload Section -->
            <div v-if="uploadType === 'file'" class="upload-materials__file-section">
              <div class="text-subtitle1 q-mb-md">{{ langStore.getText('fileUpload') }}</div>

              <q-file
                v-model="selectedFile"
                :label="langStore.getText('selectFile')"
                outlined
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.wav"
                :rules="[val => !!val || langStore.getText('fileRequired')]"
                @update:model-value="handleFileSelect"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click.stop="selectedFile = null" class="cursor-pointer" />
                </template>
              </q-file>

              <div v-if="selectedFile" class="upload-materials__file-info q-mt-md">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-subtitle2">{{ selectedFile.name }}</div>
                        <div class="text-caption text-grey-6">
                          {{ formatFileSize(selectedFile.size) }} • {{ getFileType(selectedFile.name) }}
                        </div>
                      </div>
                      <div class="col-auto">
                        <q-btn
                          flat
                          round
                          icon="delete"
                          color="negative"
                          size="sm"
                          @click="selectedFile = null"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- YouTube Link Section -->
            <div v-if="uploadType === 'youtube'" class="upload-materials__youtube-section">
              <div class="text-subtitle1 q-mb-md">{{ langStore.getText('youtubeVideo') }}</div>

              <q-input
                v-model="materialForm.youtube_link"
                :label="langStore.getText('youtubeUrl') + ' *'"
                outlined
                :rules="[
                  val => !!val || langStore.getText('youtubeUrlRequired'),
                  val => isValidYouTubeUrl(val) || langStore.getText('invalidYoutubeUrl')
                ]"
                :hint="langStore.getText('youtubeUrlHint')"
              >
                <template v-slot:prepend>
                  <q-icon name="play_circle" />
                </template>
              </q-input>

              <div v-if="materialForm.youtube_link && isValidYouTubeUrl(materialForm.youtube_link)" class="upload-materials__youtube-preview q-mt-md">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-sm">{{ langStore.getText('videoPreview') }}</div>
                    <iframe
                      :src="getYouTubeEmbedUrl(materialForm.youtube_link)"
                      width="100%"
                      height="200"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Text Content Section -->
            <div v-if="uploadType === 'text'" class="upload-materials__text-section">
              <div class="text-subtitle1 q-mb-md">{{ langStore.getText('textContent') }}</div>

              <q-input
                v-model="materialForm.text_content"
                type="textarea"
                :label="langStore.getText('content') + ' *'"
                outlined
                rows="8"
                :rules="[val => !!val || langStore.getText('contentRequired')]"
                :hint="langStore.getText('textContentHint')"
              />
            </div>

            <!-- Privacy Settings -->
            <div class="upload-materials__privacy-section">
              <div class="text-subtitle1 q-mb-md">{{ langStore.getText('privacySettings') }}</div>

              <q-toggle
                v-model="materialForm.is_public"
                :label="langStore.getText('makePublic')"
                color="primary"
              />
              <div class="text-caption text-grey-6 q-mt-sm">
                {{ langStore.getText('publicDescription') }}
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="upload-materials__actions q-mt-lg">
              <div class="row q-gutter-md">
                <div class="col-auto">
                  <q-btn
                    :label="langStore.getText('saveDraft')"
                    color="grey"
                    @click="saveDraft"
                    :loading="saving"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    :label="langStore.getText('uploadMaterial')"
                    color="primary"
                    type="submit"
                    :loading="uploading"
                    :disable="!isFormValid"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../stores/language-store'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { DatabaseService, type Material } from '../lib/database'

const langStore = useLanguageStore()
const $q = useQuasar()
const router = useRouter()

// Reactive data
const uploading = ref(false)
const saving = ref(false)
const uploadType = ref<'file' | 'youtube' | 'text'>('file')
const selectedFile = ref<File | null>(null)

const materialForm = ref({
  title: '',
  description: '',
  section_name: '',
  category: '',
  tags: '',
  youtube_link: '',
  text_content: '',
  is_public: false
})

// Computed
const isFormValid = computed(() => {
  if (!materialForm.value.title) return false

  switch (uploadType.value) {
    case 'file':
      return !!selectedFile.value
    case 'youtube':
      return !!materialForm.value.youtube_link && isValidYouTubeUrl(materialForm.value.youtube_link)
    case 'text':
      return !!materialForm.value.text_content
    default:
      return false
  }
})

const categoryOptions = [
  { label: 'النحو', value: 'grammar' },
  { label: 'الصرف', value: 'morphology' },
  { label: 'البلاغة', value: 'rhetoric' },
  { label: 'الأدب', value: 'literature' },
  { label: 'التاريخ', value: 'history' },
  { label: 'الثقافة', value: 'culture' },
  { label: 'القرآن', value: 'quran' },
  { label: 'الحديث', value: 'hadith' },
  { label: 'أخرى', value: 'other' }
]

// Methods
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const types: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Word Document',
    docx: 'Word Document',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    gif: 'Image',
    mp3: 'Audio',
    mp4: 'Video',
    wav: 'Audio'
  }
  return types[ext || ''] || 'Unknown'
}

function isValidYouTubeUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  return pattern.test(url)
}

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

function handleFileSelect(file: File | null) {
  if (file) {
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      $q.notify({
        type: 'negative',
        message: langStore.getText('fileTooLarge') || 'الملف كبير جداً. الحد الأقصى 50 ميجابايت'
      })
      selectedFile.value = null
      return
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'audio/mpeg',
      'audio/wav',
      'video/mp4'
    ]

    if (!allowedTypes.includes(file.type)) {
      $q.notify({
        type: 'negative',
        message: langStore.getText('invalidFileType') || 'نوع الملف غير مدعوم'
      })
      selectedFile.value = null
      return
    }
  }
}

async function uploadMaterial() {
  if (!isFormValid.value) return

  try {
    uploading.value = true

    let fileUrl = null
    let fileType = null
    let fileSize = null

    // Handle file upload
    if (uploadType.value === 'file' && selectedFile.value) {
      const fileName = `${Date.now()}-${selectedFile.value.name}`
      fileUrl = await DatabaseService.uploadFile(selectedFile.value, fileName)
      fileType = getFileType(selectedFile.value.name)
      fileSize = selectedFile.value.size
    }

    // Prepare material data
    const materialData: Partial<Material> = {
      title: materialForm.value.title,
      description: materialForm.value.description || null,
      section_name: materialForm.value.section_name || null,
      category: materialForm.value.category || null,
      tags: materialForm.value.tags ? materialForm.value.tags.split(',').map(tag => tag.trim()) : null,
      file_url: fileUrl,
      file_type: fileType,
      file_size: fileSize,
      youtube_link: uploadType.value === 'youtube' ? materialForm.value.youtube_link : null,
      is_public: materialForm.value.is_public
    }

    // Create material
    const material = await DatabaseService.createMaterial(materialData)

    // Log activity
    await DatabaseService.logActivity({
      action_type: 'material_uploaded',
      description: `تم رفع مادة تعليمية جديدة: ${material.title}`,
      related_entity_type: 'material',
      related_entity_id: material.id
    })

    $q.notify({
      type: 'positive',
      message: langStore.getText('materialUploaded') || 'تم رفع المادة بنجاح'
    })

    // Reset form
    resetForm()

    // Navigate back to materials page
    await router.push('/materials')

  } catch (error) {
    console.error('Error uploading material:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorUploadingMaterial') || 'حدث خطأ في رفع المادة'
    })
  } finally {
    uploading.value = false
  }
}

function saveDraft() {
  try {
    saving.value = true

    // Save as draft (you can implement draft functionality here)
    $q.notify({
      type: 'info',
      message: langStore.getText('draftSaved') || 'تم حفظ المسودة'
    })
  } catch (error) {
    console.error('Error saving draft:', error)
    $q.notify({
      type: 'negative',
      message: langStore.getText('errorSavingDraft') || 'حدث خطأ في حفظ المسودة'
    })
  } finally {
    saving.value = false
  }
}

function resetForm() {
  materialForm.value = {
    title: '',
    description: '',
    section_name: '',
    category: '',
    tags: '',
    youtube_link: '',
    text_content: '',
    is_public: false
  }
  selectedFile.value = null
  uploadType.value = 'file'
}
</script>

<style lang="scss" scoped>
.upload-materials {
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

  &__form-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }

  &__type-selection {
    margin: 2rem 0;
  }

  &__type-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &--selected {
      border-color: $primary;
      background-color: rgba($primary, 0.05);
    }
  }

  &__file-section,
  &__youtube-section,
  &__text-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 8px;
  }

  &__file-info {
    .q-card {
      background: white;
    }
  }

  &__youtube-preview {
    .q-card {
      background: white;
    }
  }

  &__privacy-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 8px;
  }

  &__actions {
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5rem;
  }
}
</style>
