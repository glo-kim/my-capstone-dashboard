<template>
  <component :is="embedded ? 'div' : 'v-card'" v-bind="!embedded ? { variant: 'flat', class: 'alerts-card pa-5', style: 'background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)' } : {}">
    <div v-if="!embedded" class="d-flex align-center justify-space-between mb-4">
      <div class="section-title">Alerts</div>
      <v-badge
        v-if="unacknowledgedCount > 0"
        :content="unacknowledgedCount"
        color="error"
        inline
      />
    </div>

    <!-- Filter chips -->
    <div class="d-flex flex-wrap align-center gap-2 mb-4">
      <v-chip-group v-model="selectedFilter" mandatory selected-class="text-primary">
        <v-chip filter variant="tonal" value="all" size="small">All</v-chip>
        <v-chip filter variant="tonal" color="error" value="critical" size="small">Critical</v-chip>
        <v-chip filter variant="tonal" color="warning" value="warning" size="small">Warning</v-chip>
        <v-chip filter variant="tonal" color="info" value="info" size="small">Info</v-chip>
      </v-chip-group>
    </div>

    <div v-for="alert in filteredAlerts" :key="alert.id" class="mb-3">
      <v-sheet
        :color="alertBgColor(alert.type)"
        rounded="0"
        class="pa-3 alert-item"
        :style="{ borderLeft: `3px solid rgb(var(--v-theme-${alertColorName(alert.type)}))` }"
      >
        <div class="d-flex align-center">
          <v-avatar :color="alertColorName(alert.type)" size="28" rounded="lg" variant="tonal" class="mr-4">
            <v-icon :icon="alertIcon(alert.type)" size="14" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-bold" style="line-height: 1.3">{{ alert.patientName }}</div>
          </div>
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            density="compact"
            @click.stop="$emit('acknowledge', alert.id)"
          />
        </div>
        <div class="alert-details">
          <div class="text-caption text-medium-emphasis" style="line-height: 1.4">{{ alert.message }}</div>
          <div class="text-caption mt-1" style="opacity: 0.5; font-size: 0.65rem">
            {{ formatTime(alert.timestamp) }}
          </div>
        </div>
      </v-sheet>
    </div>

    <div v-if="filteredAlerts.length === 0" class="text-center pa-8 text-medium-emphasis">
      <v-icon icon="mdi-bell-check-outline" size="40" class="mb-2" color="success" />
      <div class="text-body-2">No unread alerts</div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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
  embedded?: boolean
}>()

defineEmits<{
  acknowledge: [id: string]
}>()

const selectedFilter = ref<string>('all')

const unacknowledgedCount = computed(() =>
  props.alerts.filter((a) => !a.acknowledged).length
)

const unreadAlerts = computed(() =>
  props.alerts.filter((a) => !a.acknowledged)
)

const filteredAlerts = computed(() => {
  const alerts = selectedFilter.value === 'all'
    ? unreadAlerts.value
    : unreadAlerts.value.filter((a) => a.type === selectedFilter.value)
  return [...alerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

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
  const now = new Date()
  const d = new Date(timestamp)
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMs / 3_600_000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr} hr ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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
.alert-item {
  transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1),
              transform 200ms cubic-bezier(0.2, 0, 0, 1);
}
.alerts-card {
  transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
}
.alert-details {
  margin-left: 44px;
  margin-top: 4px;
}
</style>
