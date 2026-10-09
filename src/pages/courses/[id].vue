<template>
  <q-page class="q-pb-xl">
    <template v-if="course">
      <!-- Course Header -->
      <div class="hero-gradient hero text-white q-pa-md">
        <q-btn flat round icon="arrow_back" color="white" aria-label="Go back" @click="goBack" />

        <div class="row items-center q-mt-md">
          <div class="col">
            <div class="text-h5 text-weight-bold">{{ course.title }}</div>

            <div class="text-body2 q-mt-sm">{{ course.description }}</div>

            <div class="row items-center q-mt-sm q-gutter-sm">
              <q-badge class="bg-white text-primary">{{ course.level }}</q-badge>
              <span class="text-caption">{{ categoryLabel }}</span>
              <span class="text-caption">•</span>
              <span class="text-caption">{{ course.duration }}</span>
              <span class="text-caption">•</span>
              <span class="text-caption">By {{ course.instructor }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="page-container q-pa-md">
        <!-- Progress -->
        <q-card class="app-card">
          <q-card-section>
            <div class="row items-center">
              <div class="text-subtitle1 text-weight-bold">Your Progress</div>

              <q-space />

              <div class="text-primary text-weight-bold">{{ courseProgress }}%</div>
            </div>

            <q-linear-progress
              :value="courseProgress / 100"
              rounded
              color="primary"
              class="q-mt-md"
            />

            <div class="text-caption text-muted q-mt-xs">
              {{ completedLessons }} of {{ lessons.length }} lessons completed
            </div>
          </q-card-section>
        </q-card>

        <!-- Lessons -->
        <div class="section-title q-mt-xl q-mb-md">Course Lessons</div>

        <q-list separator class="app-card overflow-hidden">
          <LessonItem
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            :lesson="lesson"
            :index="index"
            :percent="courseStore.lessonPercent(lesson.id)"
            :completed="courseStore.isLessonCompleted(lesson.id)"
            :active="courseStore.activeLessonId === lesson.id"
            @open="openLesson"
          />
        </q-list>
      </div>
    </template>

    <q-card v-else class="app-card text-center q-pa-xl q-ma-md">
      <q-icon name="error_outline" size="48px" class="text-muted" />
      <div class="text-h6 q-mt-sm">Course not found</div>
      <q-btn color="primary" label="Back to Courses" unelevated class="q-mt-md" to="/courses" />
    </q-card>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { useCourseStore } from '@/stores/course'
import LessonItem from '@/components/LessonItem.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const courseStore = useCourseStore()

const course = computed(() => catalog.courseById(route.params.id))
const lessons = computed(() => (course.value ? catalog.lessonsByCourse(course.value.id) : []))
const categoryLabel = computed(() =>
  course.value ? catalog.categoryById(course.value.categoryId)?.label : '',
)
const courseProgress = computed(() =>
  course.value ? courseStore.courseProgress(course.value.id) : 0,
)
const completedLessons = computed(() =>
  course.value ? courseStore.courseCompletedLessons(course.value.id) : 0,
)

function openLesson(lessonId) {
  courseStore.setActiveLesson(lessonId)
  router.push(`/lessons/${lessonId}`)
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.hero {
  border-radius: 0 0 24px 24px;
}
</style>
