<template>
  <q-item
    clickable
    :active="active"
    active-class="text-primary text-weight-medium"
    class="q-py-md"
    :aria-label="`Lesson ${index + 1}: ${lesson.title}`"
    @click="emit('open', lesson.id)"
  >
    <q-item-section avatar>
      <q-avatar
        :class="completed ? 'bg-gradient-secondary text-white' : 'bg-gradient-primary text-white'"
      >
        <q-icon v-if="completed" name="check" size="20px" />
        <template v-else>{{ index + 1 }}</template>
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium">
        {{ lesson.title }}
      </q-item-label>

      <q-item-label caption>
        {{ lesson.duration }}
        <span v-if="percent > 0 && !completed"> • {{ percent }}% watched</span>
      </q-item-label>

      <q-linear-progress
        v-if="percent > 0 && !completed"
        :value="percent / 100"
        rounded
        color="primary"
        track-color="grey-4"
        class="q-mt-xs lesson-progress"
      />
    </q-item-section>

    <q-item-section side>
      <q-icon :name="statusIcon" :color="statusColor" size="28px" :aria-label="statusLabel" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  lesson: { type: Object, required: true },
  index: { type: Number, default: 0 },
  percent: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['open'])

const statusIcon = computed(() => {
  if (props.completed) return 'check_circle'
  if (props.percent > 0 || props.active) return 'play_circle'
  return 'radio_button_unchecked'
})

const statusColor = computed(() => {
  if (props.completed) return 'positive'
  return 'primary'
})

const statusLabel = computed(() => {
  if (props.completed) return 'Completed'
  if (props.percent > 0) return `${props.percent}% watched`
  return 'Not started'
})
</script>

<style scoped>
.lesson-progress {
  max-width: 220px;
}
</style>
