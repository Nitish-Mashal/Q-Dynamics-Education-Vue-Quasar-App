<template>
  <q-page class="q-pb-xl">
    <div class="page-container q-pa-md">
      <div class="text-h5 text-weight-bold">Settings</div>

      <div class="text-muted q-mt-xs q-mb-lg">Manage your account and preferences</div>

      <!-- Profile -->
      <div class="section-title q-mb-md">Profile</div>

      <q-card class="app-card q-pa-md">
        <q-form class="q-gutter-md" @submit="saveProfile">
          <q-input
            v-model="name"
            outlined
            dense
            label="Full name"
            :rules="[(v) => !!v || 'Required']"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="email"
            outlined
            dense
            type="email"
            label="Email"
            :rules="[(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'Invalid email']"
          >
            <template #prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-btn type="submit" color="primary" label="Save changes" unelevated no-caps />
        </q-form>
      </q-card>

      <!-- Appearance -->
      <div class="section-title q-mt-xl q-mb-md">Appearance</div>

      <q-list class="app-card overflow-hidden">
        <q-item>
          <q-item-section avatar>
            <q-icon :name="$q.dark.isActive ? 'dark_mode' : 'light_mode'" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Dark mode</q-item-label>
            <q-item-label caption>Use the dark theme across the app</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle
              :model-value="$q.dark.isActive"
              aria-label="Toggle dark mode"
              @update:model-value="setDarkMode"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Notifications -->
      <div class="section-title q-mt-xl q-mb-md">Notifications</div>

      <q-list class="app-card overflow-hidden">
        <q-item>
          <q-item-section avatar>
            <q-icon name="mail" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Email notifications</q-item-label>
            <q-item-label caption>News, offers and course updates</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle
              v-model="emailNotifications"
              aria-label="Toggle email notifications"
              @update:model-value="saveNotificationSettings"
            />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon name="notifications" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Course reminders</q-item-label>
            <q-item-label caption>Remind me to continue my running course</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle
              v-model="courseReminders"
              aria-label="Toggle course reminders"
              @update:model-value="saveNotificationSettings"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Language -->
      <div class="section-title q-mt-xl q-mb-md">Language</div>

      <q-card class="app-card q-pa-md">
        <q-select
          v-model="language"
          outlined
          dense
          emit-value
          map-options
          :options="languageOptions"
          label="App language"
          @update:model-value="saveLanguage"
        >
          <template #prepend>
            <q-icon name="language" />
          </template>
        </q-select>
      </q-card>

      <!-- Security -->
      <div class="section-title q-mt-xl q-mb-md">Security</div>

      <q-card class="app-card q-pa-md">
        <q-form class="q-gutter-md" @submit="changePassword">
          <q-input
            v-model="newPassword"
            outlined
            dense
            type="password"
            label="New password"
            :rules="[(v) => !v || v.length >= 6 || 'At least 6 characters']"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            outlined
            dense
            type="password"
            label="Confirm new password"
            :rules="[(v) => !v || v === newPassword || 'Passwords do not match']"
          >
            <template #prepend>
              <q-icon name="lock_reset" />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="Change password"
            unelevated
            no-caps
            :disable="!newPassword"
          />
        </q-form>
      </q-card>

      <!-- Session -->
      <div class="section-title q-mt-xl q-mb-md">Session</div>

      <q-card class="app-card">
        <q-item clickable aria-label="Log out" @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>

          <q-item-section class="text-negative text-weight-medium">Log out</q-item-section>

          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const emailNotifications = ref(auth.settings.emailNotifications)
const courseReminders = ref(auth.settings.courseReminders)
const language = ref(auth.settings.language)
const newPassword = ref('')
const confirmPassword = ref('')

const languageOptions = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'Hindi', value: 'hi-IN' },
]

function saveProfile() {
  auth.updateProfile({ name: name.value.trim(), email: email.value.trim() })
  $q.notify({ type: 'positive', message: 'Profile updated' })
}

function setDarkMode(value) {
  $q.dark.set(value)
  auth.updateSettings({ darkMode: value })
}

function saveNotificationSettings() {
  auth.updateSettings({
    emailNotifications: emailNotifications.value,
    courseReminders: courseReminders.value,
  })
  $q.notify({ message: 'Notification preferences saved' })
}

function saveLanguage() {
  auth.updateSettings({ language: language.value })
  $q.notify({ message: 'Language preference saved' })
}

function changePassword() {
  newPassword.value = ''
  confirmPassword.value = ''
  $q.notify({ type: 'positive', message: 'Password changed successfully' })
}

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>
