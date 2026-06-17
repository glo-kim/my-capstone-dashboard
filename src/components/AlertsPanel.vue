<template>
  <v-card variant="flat" class="alerts-card pa-5" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="section-title">Alerts</div>
      <v-badge
        v-if="unacknowledgedCount > 0"
        :content="unacknowledgedCount"
        color="error"
        inline
      />
    </div>

    <div v-for="alert in sortedAlerts" :key="alert.id" class="mb-3">
      <v-sheet
        :color="alertBgColor(alert.type)"
        rounded="xl"
        class="pa-3 alert-item"
        :class="{ 'alert-acknowledged': alert.acknowledged }"
        :style="{ borderLeft: `3px solid rgb(var(--v-theme-${alertColorName(alert.type)}))` }"
      >
        <div class="d-flex align-start gap-3">
          <v-avatar :color="alertColorName(alert.type)" size="28" rounded="lg" variant="tonal">
            <v-icon :icon="alertIcon(alert.type)" size="14" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-bold" style="line-height: 1.3">{{ alert.patientName }}</div>
            <div class="text-caption text-medium-emphasis mt-1" style="line-height: 1.4">{{ alert.message }}</div>
            <div class="text-caption mt-2" style="opacity: 0.5; font-size: 0.65rem">
              {{ formatTime(alert.timestamp) }}
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            density="compact"
            @click.stop="$emit('acknowledge', alert.id)"
          />
        </div>
      </v-sheet>
    </div>

    <div v-if="alerts.length === 0" class="text-center pa-8 text-medium-emphasis">
      <v-icon icon="mdi-bell-check-outline" size="40" class="mb-2" color="success" />
      <div class="text-body-2">All clear — no alerts</div>
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

function alertBgColor(type: string): string {
  if (type === 'critical') return 'error-container'
  if (type === 'warning') return 'warning-container'
  return 'info-container'
}

function alertColorName(type: string): string {
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
.section-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.alert-acknowledged {
  opacity: 0.4;
  transform: scale(0.98);
}
.alert-item {
  transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1),
              transform 200ms cubic-bezier(0.2, 0, 0, 1);
}
.alerts-card {
  transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
}
</style>
