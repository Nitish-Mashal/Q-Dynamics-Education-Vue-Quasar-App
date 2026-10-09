<template>
  <q-page class="q-pb-xl">
    <div class="page-container">
      <!-- Header -->
      <div class="q-pa-md">
        <q-btn flat icon="arrow_back" label="Back to Course" @click="goBack" />
      </div>

      <div class="q-px-md">
        <div class="text-caption text-primary text-weight-medium">
          {{ course.title }}
        </div>

        <div class="text-h5 text-weight-bold q-mt-xs">{{ lesson.title }}</div>

        <div class="text-muted q-mt-sm">
          Lesson {{ lessonIndex + 1 }} of {{ courseLessons.length }} • {{ lesson.duration }}
        </div>
      </div>

      <!-- Video -->
      <div class="q-pa-md">
        <div class="video-wrapper">
          <div v-if="!useFallback && lesson" :key="lesson.id" class="player-host">
            <div ref="playerMount" />
          </div>

          <q-video v-else :src="`https://www.youtube.com/embed/${lesson.videoId}`" ratio="16/9" />
        </div>

        <!-- Live progress -->
        <div class="row items-center q-mt-sm">
          <div class="text-caption text-muted">Lesson progress</div>

          <q-space />

          <div class="text-caption text-weight-bold text-primary">{{ percent }}%</div>
        </div>

        <q-linear-progress :value="percent / 100" rounded color="primary" class="q-mt-xs" />
      </div>

      <!-- Navigation -->
      <div class="row q-px-md q-gutter-sm">
        <q-btn
          flat
          dense
          icon="chevron_left"
          label="Previous"
          :disable="!prevLesson"
          @click="goToLesson(prevLesson)"
        />

        <q-space />

        <q-btn
          flat
          dense
          label="Next"
          icon-right="chevron_right"
          :disable="!nextLesson"
          @click="goToLesson(nextLesson)"
        />
      </div>

      <!-- Lesson Content -->
      <div class="q-px-md">
        <div class="section-title q-mt-lg">About this lesson</div>

        <p class="text-body1 q-mt-md">
          {{ lesson.description }}
        </p>

        <p class="text-body1">
          This lesson is part of {{ course.title }} by {{ course.instructor }}. Watch the video
          above — your progress is saved automatically as you play.
        </p>

        <!-- Complete Button -->
        <q-btn
          :color="isCompleted ? 'positive' : 'primary'"
          :icon="isCompleted ? 'check_circle' : 'check'"
          :label="isCompleted ? 'Completed' : 'Mark as Completed'"
          unelevated
          class="full-width q-mt-lg"
          :disable="isCompleted"
          @click="completeLesson"
        />

        <q-btn
          v-if="isCompleted && nextLesson"
          flat
          dense
          color="primary"
          :label="`Next: ${nextLesson.title}`"
          icon-right="arrow_forward"
          class="full-width q-mt-sm"
          @click="goToLesson(nextLesson)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCatalogStore } from '@/stores/catalog'
import { useCourseStore } from '@/stores/course'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const courseStore = useCourseStore()

const playerMount = ref(null)
const percent = ref(0)
const useFallback = ref(false)

let player = null
let pollTimer = null
let apiPromise = null
let destroyed = false

const lesson = computed(() => catalog.lessonById(route.params.id))
const course = computed(() => (lesson.value ? catalog.courseById(lesson.value.courseId) : null))
const courseLessons = computed(() =>
  lesson.value ? catalog.lessonsByCourse(lesson.value.courseId) : [],
)
const lessonIndex = computed(() =>
  lesson.value ? courseLessons.value.findIndex((l) => l.id === lesson.value.id) : -1,
)
const prevLesson = computed(() =>
  lessonIndex.value > 0 ? courseLessons.value[lessonIndex.value - 1] : null,
)
const nextLesson = computed(() =>
  lessonIndex.value >= 0 && lessonIndex.value < courseLessons.value.length - 1
    ? courseLessons.value[lessonIndex.value + 1]
    : null,
)
const isCompleted = computed(() =>
  lesson.value ? courseStore.isLessonCompleted(lesson.value.id) : false,
)

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous()
      resolve(window.YT)
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => reject(new Error('YouTube API failed to load'))
    document.head.appendChild(script)

    setTimeout(() => reject(new Error('YouTube API timed out')), 8000)
  })

  return apiPromise
}

function clearPoll() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function teardownPlayer() {
  clearPoll()
  if (player && typeof player.destroy === 'function') {
    try {
      player.destroy()
    } catch {
      // player already gone
    }
  }
  player = null
}

function startPolling(activePlayer) {
  clearPoll()
  pollTimer = setInterval(() => {
    const duration = activePlayer.getDuration ? activePlayer.getDuration() : 0
    const current = activePlayer.getCurrentTime ? activePlayer.getCurrentTime() : 0
    if (!duration || destroyed) return

    const value = Math.min(100, Math.round((current / duration) * 100))
    percent.value = value
    courseStore.saveLessonPercent(lesson.value.id, value)
  }, 1000)
}

async function initPlayer() {
  teardownPlayer()
  if (!lesson.value) return

  destroyed = false
  useFallback.value = false
  percent.value = courseStore.lessonPercent(lesson.value.id)

  try {
    const YT = await loadYouTubeApi()
    await nextTick()
    if (destroyed || !playerMount.value || !lesson.value) return

    player = new YT.Player(playerMount.value, {
      videoId: lesson.value.videoId,
      playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
      events: {
        onReady: (event) => {
          if (destroyed) return
          const activePlayer = event.target
          const duration = activePlayer.getDuration ? activePlayer.getDuration() : 0
          const saved = courseStore.lessonPercent(lesson.value.id)

          if (duration && saved > 0 && saved < 95) {
            activePlayer.seekTo((saved / 100) * duration, true)
          }

          courseStore.setActiveLesson(lesson.value.id)
          startPolling(activePlayer)
        },
        onStateChange: (event) => {
          if (destroyed) return
          if (event.data === window.YT.PlayerState.ENDED) {
            percent.value = 100
            if (lesson.value) {
              courseStore.markLessonCompleted(lesson.value.id)
              $q.notify({ type: 'positive', message: 'Lesson completed!' })
            }
          }
        },
      },
    })
  } catch {
    if (!destroyed) useFallback.value = true
  }
}

function completeLesson() {
  if (!lesson.value) return
  percent.value = 100
  courseStore.markLessonCompleted(lesson.value.id)
  $q.notify({ type: 'positive', message: 'Lesson marked as completed!' })
}

function goToLesson(target) {
  if (!target) return
  router.push(`/lessons/${target.id}`)
}

function goBack() {
  if (course.value) router.push(`/courses/${course.value.id}`)
  else router.back()
}

watch(
  () => route.params.id,
  async () => {
    teardownPlayer()
    await nextTick()
    initPlayer()
  },
)

onMounted(() => {
  initPlayer()
})

onBeforeUnmount(() => {
  destroyed = true
  teardownPlayer()
})
</script>

<style scoped>
.video-wrapper {
  border-radius: var(--app-radius);
  overflow: hidden;
  box-shadow: var(--app-shadow);
  background: #000;
}

.player-host,
.player-host :deep(iframe) {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  display: block;
}
</style>
