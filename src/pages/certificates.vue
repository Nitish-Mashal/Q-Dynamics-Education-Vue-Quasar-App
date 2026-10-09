<template>
  <q-page class="q-pb-xl">
    <div class="hero-gradient hero text-white q-pa-md">
      <div class="text-h5 text-weight-bold">Certificates</div>
      <div class="text-body2 q-mt-sm">
        {{ earnedCount }} of {{ certificates.length }} certificates earned
      </div>
    </div>

    <div class="page-container q-pa-md">
      <q-linear-progress
        :value="certificates.length ? earnedCount / certificates.length : 0"
        rounded
        color="white"
        track-color="grey-4"
        class="q-mt-md"
      />

      <div class="row q-col-gutter-lg q-mt-lg">
        <div v-for="item in certificates" :key="item.course.id" class="col-12 col-sm-6 col-md-4">
          <q-card class="app-card full-height column" :class="{ 'locked-card': !item.earned }">
            <q-card-section class="col">
              <div class="row items-start">
                <q-avatar
                  size="54px"
                  :class="item.earned ? 'bg-gradient-warning text-white' : 'bg-grey-4 text-muted'"
                >
                  <q-icon :name="item.earned ? 'emoji_events' : 'lock'" size="30px" />
                </q-avatar>

                <q-space />

                <q-badge v-if="item.earned" color="positive" label="Earned" />
                <q-badge v-else color="grey-5" label="Locked" />
              </div>

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                {{ item.course.title }}
              </div>

              <div class="text-caption text-muted q-mt-xs">
                {{ catalog.categoryById(item.course.categoryId)?.label }} •
                {{ item.course.level }}
              </div>

              <div v-if="item.earned" class="text-caption text-muted q-mt-sm">
                Issued on {{ item.date }}<br />
                ID: {{ item.certificateId }}
              </div>

              <template v-else>
                <div class="text-caption text-muted q-mt-sm">
                  Finish every lesson to unlock this certificate.
                </div>

                <div class="row items-center q-mt-sm">
                  <div class="text-caption text-muted">Progress</div>

                  <q-space />

                  <div class="text-caption text-weight-bold">{{ item.progress }}%</div>
                </div>

                <q-linear-progress
                  :value="item.progress / 100"
                  rounded
                  color="primary"
                  class="q-mt-xs"
                />
              </template>
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn
                v-if="item.earned"
                flat
                dense
                color="primary"
                icon="download"
                label="Download"
                class="full-width"
                @click="download(item)"
              />
              <q-btn
                v-else
                flat
                dense
                color="primary"
                icon="school"
                label="Continue course"
                class="full-width"
                @click="openCourse(item.course.id)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCatalogStore } from '@/stores/catalog'
import { useCourseStore } from '@/stores/course'

const $q = useQuasar()
const router = useRouter()
const catalog = useCatalogStore()
const courseStore = useCourseStore()

const certificates = computed(() => courseStore.certificates)
const earnedCount = computed(() => certificates.value.filter((c) => c.earned).length)

function download(item) {
  const content = [
    'LEARNING APP — CERTIFICATE OF COMPLETION',
    '',
    `Certificate ID: ${item.certificateId}`,
    `Course: ${item.course.title}`,
    `Level: ${item.course.level}`,
    `Issued: ${item.date}`,
  ].join('\n')

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${item.certificateId}-${item.course.title.replace(/\s+/g, '-').toLowerCase()}.txt`
  link.click()
  URL.revokeObjectURL(url)

  $q.notify({ type: 'positive', message: 'Certificate downloaded!' })
}

function openCourse(id) {
  router.push(`/courses/${id}`)
}
</script>

<style scoped>
.hero {
  border-radius: 0 0 24px 24px;
}

.locked-card {
  opacity: 0.85;
}
</style>
