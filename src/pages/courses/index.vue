<template>
  <q-page class="q-pb-xl">
    <div class="page-container q-pa-md">
      <div class="row items-center">
        <div>
          <div class="text-h5 text-weight-bold">{{ pageTitle }}</div>

          <div class="text-muted q-mt-xs q-mb-lg">{{ pageSubtitle }}</div>
        </div>

        <q-space />

        <q-btn
          v-if="activeCategory"
          flat
          dense
          no-caps
          icon="close"
          label="Clear filter"
          color="primary"
          @click="clearFilter"
        />
      </div>

      <!-- Category chips -->
      <div class="row q-col-gutter-sm q-mb-lg">
        <div v-for="category in catalog.categories" :key="category.id">
          <q-chip
            :selected="activeCategory === category.id"
            clickable
            :color="activeCategory === category.id ? 'primary' : 'grey-4'"
            :text-color="activeCategory === category.id ? 'white' : 'dark'"
            :icon="category.icon"
            :label="category.label"
            @click="toggleCategory(category.id)"
          />
        </div>
      </div>

      <!-- Courses -->
      <div v-if="filteredCourses.length" class="row q-col-gutter-lg">
        <div v-for="course in filteredCourses" :key="course.id" class="col-12 col-sm-6 col-md-4">
          <CourseCard :course="course" @open="openCourse" />
        </div>
      </div>

      <q-card v-else class="app-card text-center q-pa-lg">
        <q-icon name="menu_book" size="40px" class="text-muted" />
        <div class="text-subtitle1 q-mt-sm">No courses in this category yet</div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import CourseCard from '@/components/CourseCard.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()

const activeCategory = computed(() => {
  const value = route.query.category
  return typeof value === 'string' && catalog.categoryById(value) ? value : null
})

const filteredCourses = computed(() =>
  activeCategory.value ? catalog.coursesByCategory(activeCategory.value) : catalog.courses,
)

const pageTitle = computed(() =>
  activeCategory.value ? catalog.categoryById(activeCategory.value).label : 'Courses',
)

const pageSubtitle = computed(() =>
  activeCategory.value
    ? `${filteredCourses.value.length} courses to explore`
    : 'Explore all courses and start learning',
)

function toggleCategory(categoryId) {
  router.push({
    path: '/courses',
    query: activeCategory.value === categoryId ? {} : { category: categoryId },
  })
}

function clearFilter() {
  router.push('/courses')
}

function openCourse(id) {
  router.push(`/courses/${id}`)
}
</script>
