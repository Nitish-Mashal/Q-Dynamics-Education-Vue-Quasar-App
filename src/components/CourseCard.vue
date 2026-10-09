<template>
  <q-card
    class="app-card app-card--hover full-height column"
    tabindex="0"
    role="button"
    :aria-label="course.title"
    @click="emit('open', course.id)"
    @keyup.enter="emit('open', course.id)"
  >
    <q-img :src="course.image" height="170px" role="img" :aria-label="course.title" />

    <q-card-section class="col">
      <div class="text-h6 text-weight-bold">
        {{ course.title }}
      </div>

      <div class="text-muted q-mt-sm">
        {{ course.description }}
      </div>

      <div class="row items-center q-mt-md">
        <q-icon name="play_circle" color="primary" />

        <span class="text-caption q-ml-xs"> {{ lessons }} Lessons </span>

        <q-space />

        <q-badge class="bg-gradient-primary text-white q-pa-xs">
          {{ course.level }}
        </q-badge>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row items-center">
        <div class="text-caption text-muted">Progress</div>

        <q-space />

        <div class="text-caption text-weight-bold">{{ progress }}%</div>
      </div>

      <q-linear-progress :value="progress / 100" rounded color="primary" class="q-mt-xs" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useCourseStore } from '@/stores/course'

const props = defineProps({
  course: { type: Object, required: true },
})

const emit = defineEmits(['open'])

const catalog = useCatalogStore()
const courseStore = useCourseStore()

const lessons = computed(() => catalog.lessonsByCourse(props.course.id).length)
const progress = computed(() => courseStore.courseProgress(props.course.id))
</script>
