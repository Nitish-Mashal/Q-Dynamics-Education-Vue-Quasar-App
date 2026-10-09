<template>
  <q-page class="q-pb-xl">
    <div class="page-container">
      <!-- Welcome -->
      <div class="q-pa-md">
        <div class="text-subtitle1 text-muted">Welcome back 👋</div>

        <div class="text-h5 text-weight-bold">What do you want to learn?</div>
      </div>

      <!-- Search -->
      <div class="q-px-md">
        <q-input
          v-model="search"
          outlined
          rounded
          dense
          placeholder="Search courses..."
          aria-label="Search courses"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>

          <template v-if="search" #append>
            <q-icon
              name="close"
              class="cursor-pointer"
              aria-label="Clear search"
              @click="search = ''"
            />
          </template>
        </q-input>
      </div>

      <!-- Search results -->
      <div v-if="search.trim()" class="q-pa-md">
        <div class="section-title q-mb-md">
          {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }} for "{{
            search.trim()
          }}"
        </div>

        <div v-if="searchResults.length" class="row q-col-gutter-lg">
          <div v-for="course in searchResults" :key="course.id" class="col-12 col-sm-6 col-md-4">
            <CourseCard :course="course" @open="openCourse" />
          </div>
        </div>

        <q-card v-else class="app-card text-center q-pa-lg">
          <q-icon name="search_off" size="40px" class="text-muted" />
          <div class="text-subtitle1 q-mt-sm">No courses found</div>
          <div class="text-caption text-muted">Try a different keyword</div>
        </q-card>
      </div>

      <template v-else>
        <!-- Continue Learning -->
        <div class="q-pa-md">
          <div class="section-title q-mb-md">Continue Learning</div>

          <q-card
            v-if="continueTarget"
            class="app-card app-card--hover"
            tabindex="0"
            @click="continueLearning"
            @keyup.enter="continueLearning"
          >
            <q-card-section>
              <div class="row items-center">
                <q-avatar size="55px" class="bg-gradient-primary text-white">
                  <q-icon :name="categoryIcon" size="30px" />
                </q-avatar>

                <div class="q-ml-md col">
                  <div class="text-subtitle1 text-weight-bold">
                    {{ continueTarget.course.title }}
                  </div>

                  <div class="text-caption text-muted">
                    Lesson {{ continueTarget.lessonNumber }} of {{ continueTarget.totalLessons }} •
                    {{ continueTarget.lesson.title }}
                  </div>
                </div>

                <q-badge class="bg-gradient-accent text-white q-pa-xs">
                  {{ continueTarget.lessonProgress }}% watched
                </q-badge>
              </div>

              <q-linear-progress
                :value="continueTarget.courseProgress / 100"
                rounded
                color="primary"
                class="q-mt-md"
              />

              <div class="text-caption text-muted q-mt-xs">
                {{ continueTarget.courseProgress }}% completed
              </div>
            </q-card-section>

            <q-card-actions>
              <q-btn
                color="primary"
                label="Continue Learning"
                unelevated
                class="full-width"
                @click.stop="continueLearning"
              />
            </q-card-actions>
          </q-card>

          <q-card v-else class="app-card text-center q-pa-lg">
            <q-icon name="school" size="40px" class="text-muted" />
            <div class="text-subtitle1 q-mt-sm">No course in progress yet</div>
            <div class="text-caption text-muted q-mt-xs">
              Pick a category below to start learning
            </div>
          </q-card>
        </div>

        <!-- Categories -->
        <div class="q-px-md">
          <div class="section-title q-mb-md">Categories</div>

          <div class="row q-col-gutter-md">
            <div v-for="category in categories" :key="category.id" class="col-6 col-sm-3">
              <q-card
                class="app-card app-card--hover full-height"
                tabindex="0"
                :aria-label="`${category.label} category`"
                @click="goCourses(category.id)"
                @keyup.enter="goCourses(category.id)"
              >
                <q-card-section class="text-center">
                  <div class="icon-chip" :class="category.gradient">
                    <q-icon :name="category.icon" size="30px" />
                  </div>

                  <div class="text-subtitle1 text-weight-medium q-mt-sm">
                    {{ category.label }}
                  </div>

                  <div class="text-caption text-muted">
                    {{ catalog.categoryCount(category.id) }} Courses
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { useCourseStore } from '@/stores/course'
import CourseCard from '@/components/CourseCard.vue'

const router = useRouter()
const catalog = useCatalogStore()
const courseStore = useCourseStore()

const search = ref('')

const categories = computed(() => catalog.categories)
const searchResults = computed(() => catalog.searchCourses(search.value))
const continueTarget = computed(() => courseStore.continueTarget)

const categoryIcon = computed(() => {
  if (!continueTarget.value) return 'school'
  return catalog.categoryById(continueTarget.value.course.categoryId)?.icon || 'school'
})

function goCourses(categoryId) {
  router.push({ path: '/courses', query: { category: categoryId } })
}

function openCourse(id) {
  router.push(`/courses/${id}`)
}

function continueLearning() {
  const target = continueTarget.value
  if (!target) return
  courseStore.setActiveLesson(target.lesson.id)
  router.push(`/lessons/${target.lesson.id}`)
}
</script>
