import { defineStore, acceptHMRUpdate } from 'pinia'

const USER_KEY = 'learning-app-user'
const SETTINGS_KEY = 'learning-app-settings'

const defaultSettings = {
  darkMode: false,
  emailNotifications: true,
  courseReminders: true,
  language: 'en-US',
}

export function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function readStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings }
  } catch {
    return { ...defaultSettings }
  }
}

function persistUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {
    // storage unavailable
  }
}

function persistSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // storage unavailable
  }
}

function nameFromEmail(email) {
  const prefix = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim()
  return prefix
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readStoredUser(),
    settings: readStoredSettings(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    login(email, password) {
      if (!email || !password) {
        throw new Error('Please enter your email and password.')
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address.')
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.')
      }

      this.user = {
        name: nameFromEmail(email),
        email,
        avatar: null,
        role: 'Learner',
        memberSince: new Date().toISOString().slice(0, 10),
      }
      persistUser(this.user)
    },

    logout() {
      this.user = null
      persistUser(null)
    },

    updateProfile({ name, email }) {
      if (!this.user) return
      if (name) this.user.name = name
      if (email) this.user.email = email
      persistUser(this.user)
    },

    updateAvatar(dataUrl) {
      if (!this.user) return
      this.user.avatar = dataUrl
      persistUser(this.user)
    },

    removeAvatar() {
      if (!this.user) return
      this.user.avatar = null
      persistUser(this.user)
    },

    updateSettings(partial) {
      this.settings = { ...this.settings, ...partial }
      persistSettings(this.settings)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
