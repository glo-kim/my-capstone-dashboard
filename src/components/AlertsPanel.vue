<template>
  <v-card class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="text-subtitle-1 font-weight-bold">Alerts</div>
      <v-chip size="x-small" color="error" variant="flat" v-if="unacknowledgedCount > 0">
        {{ unacknowledgedCount }}
      </v-chip>
    </div>

    <div v-for="alert in sortedAlerts" :key="alert.id" class="mb-3">
      <v-alert
        :type="alertType(alert.type)"
        :icon="alertIcon(alert.type)"
        density="compact"
        variant="tonal"
        rounded="xl"
        :class="{ 'alert-acknowledged': alert.acknowledged }"
        closable
        @click:close="$emit('acknowledge', alert.id)"
      >
        <div class="text-body-2 font-weight-medium">{{ alert.patientName }}</div>
        <div class="text-caption">{{ alert.message }}</div>
        <div class="text-caption text-medium-emphasis mt-1">
          {{ formatTime(alert.timestamp) }}
        </div>
      </v-alert>
    </div>

    <div v-if="alerts.length === 0" class="text-center pa-6 text-medium-emphasis">
      <v-icon icon="mdi-bell-check-outline" size="40" class="mb-2" />
      <div class="text-body-2">No alerts</div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Alert {
  id: string
  type: string
  caseId: string
  patientId: string
  patientName: string
  message: string
  timestamp: string
  acknowledged: boolean
}

const props = defineProps<{
  alerts: Alert[]
}>()

defineEmits<{
  acknowledge: [id: string]
}>()

const unacknowledgedCount = computed(() =>
  props.alerts.filter((a) => !a.acknowledged).length
)

const sortedAlerts = computed(() =>
  [...props.alerts].sort((a, b) => {
    const priority: Record<string, number> = { critical: 0, warning: 1, info: 2 }
    const pa = priority[a.type] ?? 3
    const pb = priority[b.type] ?? 3
    if (pa !== pb) return pa - pb
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
)

function alertType(type: string): 'error' | 'warning' | 'info' {
  if (type === 'critical') return 'error'
  if (type === 'warning') return 'warning'
  return 'info'
}

function alertIcon(type: string) {
  if (type === 'critical') return 'mdi-alert-circle'
  if (type === 'warning') return 'mdi-alert'
  return 'mdi-information'
}

function formatTime(timestamp: string) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
</script>

<style scoped>
.alert-acknowledged {
  opacity: 0.5;
}
</style>
