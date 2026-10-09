<template>
  <q-page class="q-pb-xl">
    <div class="login-wrap">
      <q-card class="app-card login-card q-pa-lg">
        <div class="text-center q-mb-lg">
          <div class="icon-chip bg-gradient-primary q-mb-md">
            <q-icon name="school" size="32px" />
          </div>

          <div class="text-h5 text-weight-bold">Welcome back</div>

          <div class="text-muted q-mt-xs">Sign in to continue learning</div>
        </div>

        <q-form class="q-gutter-md" @submit="onSubmit">
          <q-input
            v-model="email"
            outlined
            dense
            type="email"
            label="Email"
            aria-label="Email"
            :rules="[(val) => !!val || 'Email is required']"
          >
            <template #prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            outlined
            dense
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            aria-label="Password"
            :rules="[(val) => !!val || 'Password is required']"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>

            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox v-model="remember" dense label="Remember me" class="text-muted" />

            <q-btn flat dense no-caps color="primary" label="Forgot password?" @click="onForgot" />
          </div>

          <q-btn
            type="submit"
            color="primary"
            label="Sign In"
            unelevated
            class="full-width"
            :loading="loading"
          />
        </q-form>

        <q-separator class="q-my-lg" />

        <div class="text-caption text-muted text-center">
          Demo account — any valid email with a 6+ character password works.
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const email = ref('demo@learning.app')
const password = ref('demo123')
const showPassword = ref(false)
const remember = ref(true)
const loading = ref(false)

function onSubmit() {
  loading.value = true

  setTimeout(() => {
    try {
      auth.login(email.value.trim(), password.value)
      $q.notify({ type: 'positive', message: `Welcome back, ${auth.user.name}!` })
      const redirect = route.query.redirect || '/'
      router.replace(String(redirect))
    } catch (error) {
      $q.notify({ type: 'negative', message: error.message })
    } finally {
      loading.value = false
    }
  }, 400)
}

function onForgot() {
  $q.notify({ message: 'Password reset is not available in this demo.' })
}
</script>

<style scoped>
.login-wrap {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
}
</style>
