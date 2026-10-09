import { defineStore, acceptHMRUpdate } from 'pinia'
import { useCatalogStore } from './catalog'

const STORAGE_KEY = 'learning-app-progress'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        progress: parsed.progress || {},
        completedAt: parsed.completedAt || {},
        activeLessonId: parsed.activeLessonId ?? null,
      }
    }
  } catch {
    // corrupted storage — fall through to seed
  }

  return {
    // Seed: course 1 fully finished (certificate earned),
    // course 2 is the running course with lesson 2 in progress.
    progress: {
      1: { percent: 100, completed: true },
      2: { percent: 100, completed: true },
      3: { percent: 100, completed: true },
      4: { percent: 100, completed: true },
      5: { percent: 60, completed: false },
      6: { percent: 0, completed: false },
    },
    completedAt: { 1: '2026-09-12' },
    activeLessonId: 5,
  }
}

export const useCourseStore = defineStore('course', {
  state: () => loadState(),

  getters: {
    lessonPercent: (state) => (lessonId) => state.progress[lessonId]?.percent ?? 0,

    isLessonCompleted: (state) => (lessonId) => state.progress[lessonId]?.completed ?? false,

    activeLesson() {
      if (this.activeLessonId == null) return null
      return useCatalogStore().lessonById(this.activeLessonId)
    },

    courseProgress() {
      const catalog = useCatalogStore()
      return (courseId) => {
        const lessons = catalog.lessonsByCourse(courseId)
        if (!lessons.length) return 0
        const total = lessons.reduce(
          (sum, lesson) => sum + (this.progress[lesson.id]?.percent ?? 0),
          0,
        )
        return Math.round(total / lessons.length)
      }
    },

    courseCompletedLessons() {
      const catalog = useCatalogStore()
      return (courseId) =>
        catalog.lessonsByCourse(courseId).filter((l) => this.progress[l.id]?.completed).length
    },

    isCourseCompleted() {
      return (courseId) => {
        const catalog = useCatalogStore()
        const lessons = catalog.lessonsByCourse(courseId)
        return lessons.length > 0 && lessons.every((l) => this.progress[l.id]?.completed)
      }
    },

    /** Data for the "Continue Learning" card: running course + class. */
    continueTarget() {
      const catalog = useCatalogStore()
      let lesson = this.activeLesson

      if (!lesson) {
        const inProgress = catalog.lessons.find(
          (l) => (this.progress[l.id]?.percent ?? 0) > 0 && !this.progress[l.id]?.completed,
        )
        lesson = inProgress || null
      }
      if (!lesson) return null

      const course = catalog.courseById(lesson.courseId)
      const courseLessons = catalog.lessonsByCourse(lesson.courseId)
      const index = courseLessons.findIndex((l) => l.id === lesson.id)

      return {
        lesson,
        course,
        lessonNumber: index + 1,
        totalLessons: courseLessons.length,
        courseProgress: this.courseProgress(lesson.courseId),
        lessonProgress: this.progress[lesson.id]?.percent ?? 0,
      }
    },

    /** Certificates: earned for finished courses, locked for the rest. */
    certificates() {
      const catalog = useCatalogStore()
      return catalog.courses.map((course) => {
        const earned = this.isCourseCompleted(course.id)
        return {
          course,
          earned,
          date: earned ? this.completedAt[course.id] || 'Today' : null,
          progress: this.courseProgress(course.id),
          certificateId: `CERT-${String(course.id).padStart(4, '0')}`,
        }
      })
    },

    stats() {
      const catalog = useCatalogStore()
      const started = catalog.courses.filter((c) => this.courseProgress(c.id) > 0).length
      const lessonsDone = catalog.lessons.filter((l) => this.progress[l.id]?.completed).length
      const avg =
        catalog.courses.length === 0
          ? 0
          : Math.round(
              catalog.courses.reduce((sum, c) => sum + this.courseProgress(c.id), 0) /
                catalog.courses.length,
            )
      return { courses: started, lessons: lessonsDone, progress: avg }
    },
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            progress: this.progress,
            completedAt: this.completedAt,
            activeLessonId: this.activeLessonId,
          }),
        )
      } catch {
        // storage unavailable — state stays in memory
      }
    },

    setActiveLesson(lessonId) {
      this.activeLessonId = lessonId
      this.persist()
    },

    saveLessonPercent(lessonId, percent) {
      const clamped = Math.max(0, Math.min(100, Math.round(percent)))
      const existing = this.progress[lessonId]

      if (existing?.completed) {
        this.activeLessonId = lessonId
        this.persist()
        return
      }

      // Progress only moves forward — seeking back never lowers it.
      const nextPercent = Math.max(existing?.percent ?? 0, clamped)
      const completed = nextPercent >= 95

      this.progress[lessonId] = { percent: nextPercent, completed }
      if (completed) this.recordCourseCompletion(lessonId)

      this.activeLessonId = lessonId
      this.persist()
    },

    recordCourseCompletion(lessonId) {
      const catalog = useCatalogStore()
      const lesson = catalog.lessonById(lessonId)
      if (lesson && this.isCourseCompleted(lesson.courseId) && !this.completedAt[lesson.courseId]) {
        this.completedAt[lesson.courseId] = new Date().toISOString().slice(0, 10)
      }
    },

    markLessonCompleted(lessonId) {
      this.progress[lessonId] = { percent: 100, completed: true }
      this.recordCourseCompletion(lessonId)
      this.activeLessonId = lessonId
      this.persist()
    },

    resetProgress() {
      this.progress = {}
      this.completedAt = {}
      this.activeLessonId = null
      this.persist()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCourseStore, import.meta.hot))
}
