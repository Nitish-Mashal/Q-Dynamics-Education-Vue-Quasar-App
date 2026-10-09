<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="hero-gradient text-white">
      <q-toolbar>
        <q-btn
          flat
          no-caps
          to="/"
          icon="school"
          label="Learning App"
          class="text-white text-h6 text-weight-bold"
          aria-label="Learning App home"
        />

        <q-space />

        <!-- Desktop navigation -->
        <q-tabs
          v-if="isDesktop && auth.isAuthenticated"
          no-caps
          active-color="white"
          indicator-color="white"
          class="text-white"
          shrink
        >
          <q-route-tab to="/" icon="home" label="Home" exact />
          <q-route-tab to="/courses" icon="school" label="Courses" />
          <q-route-tab to="/certificates" icon="emoji_events" label="Certificates" />
          <q-route-tab to="/profile" icon="person" label="Profile" />
        </q-tabs>

        <!-- Theme toggle -->
        <q-btn flat round dense :icon="darkIcon" :aria-label="darkLabel" @click="toggleDark" />

        <!-- Account menu -->
        <q-btn v-if="auth.isAuthenticated" flat round class="q-ml-sm" aria-label="Account">
          <q-avatar size="32px" class="bg-gradient-primary text-white">
            <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="Profile picture" />
            <q-icon v-else name="person" size="20px" />
          </q-avatar>

          <q-menu>
            <div class="row no-wrap q-pa-md">
              <q-avatar size="56px" class="bg-gradient-primary text-white">
                <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="Profile picture" />
                <q-icon v-else name="person" size="30px" />
              </q-avatar>

              <div class="q-ml-md column items-start">
                <div class="text-subtitle1 text-weight-bold">{{ auth.user?.name }}</div>
                <div class="text-caption text-muted">{{ auth.user?.email }}</div>

                <q-btn
                  dense
                  no-caps
                  label="Profile"
                  color="primary"
                  class="q-mt-sm"
                  to="/profile"
                />
                <q-btn
                  flat
                  dense
                  no-caps
                  label="Log out"
                  class="q-mt-xs text-negative"
                  @click="logout"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Mobile bottom navigation -->
    <q-footer v-if="!isDesktop && auth.isAuthenticated" bordered class="app-footer text-muted">
      <q-tabs no-caps active-color="primary" indicator-color="transparent">
        <q-route-tab to="/" icon="home" label="Home" exact />
        <q-route-tab to="/courses" icon="school" label="Courses" />
        <q-route-tab to="/certificates" icon="emoji_events" label="Certificates" />
        <q-route-tab to="/profile" icon="person" label="Profile" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const isDesktop = computed(() => $q.screen.gt.sm)

const darkIcon = computed(() => ($q.dark.isActive ? 'light_mode' : 'dark_mode'))
const darkLabel = computed(() =>
  $q.dark.isActive ? 'Switch to light mode' : 'Switch to dark mode',
)

if (auth.settings.darkMode !== $q.dark.isActive) {
  $q.dark.set(auth.settings.darkMode)
}

function toggleDark() {
  $q.dark.toggle()
  auth.updateSettings({ darkMode: $q.dark.isActive })
}

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>
