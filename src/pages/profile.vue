<template>
  <q-page class="q-pb-xl">
    <div class="page-container q-pa-md">
      <!-- Profile -->
      <div class="text-center q-pt-md">
        <div
          class="avatar-edit cursor-pointer"
          role="button"
          aria-label="Change profile picture"
          tabindex="0"
          @click="avatarDialog = true"
          @keyup.enter="avatarDialog = true"
        >
          <q-avatar size="90px" class="bg-gradient-primary text-white">
            <img v-if="avatarUrl" :src="avatarUrl" alt="Profile picture" />
            <q-icon v-else name="person" size="50px" />
          </q-avatar>

          <div class="avatar-badge">
            <q-icon name="photo_camera" size="16px" />
          </div>

          <div class="text-caption text-primary q-mt-xs">Change photo</div>
        </div>

        <div class="text-h6 text-weight-bold q-mt-md">{{ auth.user?.name }}</div>

        <div class="text-muted">{{ auth.user?.role || 'Learner' }}</div>

        <div class="text-caption text-muted q-mt-xs">{{ auth.user?.email }}</div>
      </div>

      <!-- Statistics -->
      <div class="row q-col-gutter-md q-mt-xl">
        <div v-for="stat in stats" :key="stat.label" class="col-4">
          <q-card class="app-card text-center full-height">
            <q-card-section>
              <div class="text-h6 text-primary">
                {{ stat.value }}
              </div>

              <div class="text-caption text-muted">
                {{ stat.label }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Profile Menu -->
      <q-list separator class="app-card overflow-hidden q-mt-xl">
        <q-item clickable aria-label="My Courses" @click="go('/courses')">
          <q-item-section avatar>
            <q-icon name="school" color="primary" />
          </q-item-section>

          <q-item-section> My Courses </q-item-section>

          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>

        <q-item clickable aria-label="Certificates" @click="go('/certificates')">
          <q-item-section avatar>
            <q-icon name="emoji_events" class="text-warning" />
          </q-item-section>

          <q-item-section> Certificates </q-item-section>

          <q-item-section side>
            <q-badge :color="earnedCertificates ? 'positive' : 'grey-5'">
              {{ earnedCertificates ? `${earnedCertificates} earned` : 'None yet' }}
            </q-badge>
          </q-item-section>
        </q-item>

        <q-item clickable aria-label="Settings" @click="go('/settings')">
          <q-item-section avatar>
            <q-icon name="settings" class="text-muted" />
          </q-item-section>

          <q-item-section> Settings </q-item-section>

          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>

        <q-item clickable aria-label="Log out" @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>

          <q-item-section class="text-negative"> Log out </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Avatar update dialog -->
    <q-dialog v-model="avatarDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 320px">
        <div class="text-h6 text-weight-bold">Update profile picture</div>

        <div class="text-muted text-caption q-mt-xs">
          JPG or PNG, up to 2 MB. Stored locally in your browser.
        </div>

        <div class="text-center q-mt-lg">
          <q-avatar size="110px" class="bg-gradient-primary text-white">
            <img v-if="previewUrl || avatarUrl" :src="previewUrl || avatarUrl" alt="Preview" />
            <q-icon v-else name="person" size="56px" />
          </q-avatar>
        </div>

        <q-file
          v-model="file"
          outlined
          dense
          accept="image/*"
          label="Choose an image"
          class="q-mt-lg"
          @update:model-value="onFileSelected"
        >
          <template #prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <q-card-actions align="right" class="q-mt-md">
          <q-btn flat label="Remove" color="negative" :disable="!avatarUrl" @click="removePhoto" />
          <q-btn flat label="Cancel" v-close-popup @click="resetPreview" />
          <q-btn
            unelevated
            label="Save"
            color="primary"
            :disable="!previewUrl"
            @click="savePhoto"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import { useCourseStore } from '@/stores/course'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()
const courseStore = useCourseStore()

const avatarDialog = ref(false)
const file = ref(null)
const previewUrl = ref(null)

const avatarUrl = computed(() => auth.user?.avatar || null)

const stats = computed(() => {
  const values = courseStore.stats
  return [
    { value: values.courses, label: 'Courses' },
    { value: values.lessons, label: 'Lessons' },
    { value: `${values.progress}%`, label: 'Progress' },
  ]
})

const earnedCertificates = computed(() => courseStore.certificates.filter((c) => c.earned).length)

function onFileSelected(selected) {
  previewUrl.value = null
  if (!selected) return

  if (selected.size > 2 * 1024 * 1024) {
    $q.notify({ type: 'negative', message: 'Image must be smaller than 2 MB' })
    file.value = null
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    previewUrl.value = reader.result
  }
  reader.readAsDataURL(selected)
}

function savePhoto() {
  if (!previewUrl.value) return
  auth.updateAvatar(previewUrl.value)
  resetPreview()
  avatarDialog.value = false
  $q.notify({ type: 'positive', message: 'Profile picture updated' })
}

function removePhoto() {
  auth.removeAvatar()
  resetPreview()
  avatarDialog.value = false
  $q.notify({ message: 'Profile picture removed' })
}

function resetPreview() {
  file.value = null
  previewUrl.value = null
}

function go(path) {
  router.push(path)
}

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<style scoped>
.avatar-edit {
  position: relative;
  display: inline-block;
}

.avatar-badge {
  position: absolute;
  right: -6px;
  bottom: 22px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--q-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}
</style>
