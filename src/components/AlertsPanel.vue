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

    <!-- Tabs -->
    <v-tabs v-model="activeTab" density="compact" color="primary" class="mb-4">
      <v-tab value="unread">Unread</v-tab>
      <v-tab value="pinned">Pinned</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item value="unread">
        <!-- Filter chips -->
        <div class="d-flex flex-wrap align-center gap-2 mb-4">
          <v-chip-group v-model="selectedFilter" mandatory selected-class="text-primary">
            <v-chip filter variant="tonal" value="all" size="small">All</v-chip>
            <v-chip filter variant="tonal" color="error" value="critical" size="small">Critical</v-chip>
            <v-chip filter variant="tonal" color="warning" value="warning" size="small">Warning</v-chip>
            <v-chip filter variant="tonal" color="info" value="info" size="small">Info</v-chip>
          </v-chip-group>
        </div>

        <v-list density="compact" class="pa-0 bg-transparent" style="overflow: visible">
          <v-list-item
            v-for="alert in filteredAlerts"
            :key="alert.id"
            class="px-0 alert-item align-start"
          >
            <template #prepend>
              <v-avatar :color="alertColorName(alert.type)" size="28" rounded="lg" variant="tonal" style="margin-top: 2px">
                <v-icon :icon="alertIcon(alert.type)" size="14" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2 font-weight-bold" style="line-height: 1.3">
              {{ alert.patientName }}
              <v-icon v-if="alert.pinned" icon="mdi-pin" size="12" color="primary" class="ml-1" style="vertical-align: middle" />
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption text-medium-emphasis" style="line-height: 1.4; white-space: normal">
              {{ alert.message }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-caption mt-1" style="opacity: 0.5; font-size: 0.65rem">
              {{ formatTime(alert.timestamp) }}
            </v-list-item-subtitle>
            <template #append>
              <v-menu location="bottom end">
                <template #activator="{ props: menuProps }">
                  <v-btn
                    v-bind="menuProps"
                    icon="mdi-dots-vertical"
                    size="x-small"
                    variant="text"
                    density="compact"
                    style="margin-top: 2px"
                  />
                </template>
                <v-list density="compact" min-width="180" rounded="0" class="py-1">
                  <v-list-item
                    prepend-icon="mdi-archive-outline"
                    title="Archive Alert"
                    @click="$emit('archive', alert.id)"
                  />
                  <v-list-item
                    :prepend-icon="alert.pinned ? 'mdi-pin-off-outline' : 'mdi-pin-outline'"
                    :title="alert.pinned ? 'Unpin Alert' : 'Pin Alert'"
                    @click="$emit('pin', alert.id)"
                  />
                  <v-list-item
                    prepend-icon="mdi-open-in-new"
                    title="View Case Details"
                    @click="$emit('view-details', alert)"
                  />
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
        </v-list>

        <div v-if="filteredAlerts.length === 0" class="text-center pa-8 text-medium-emphasis">
          <v-icon icon="mdi-bell-check-outline" size="40" class="mb-2" color="success" />
          <div class="text-body-2">No unread alerts</div>
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item value="pinned">
        <v-list density="compact" class="pa-0 bg-transparent" style="overflow: visible">
          <v-list-item
            v-for="alert in pinnedAlerts"
            :key="alert.id"
            class="px-0 alert-item align-start"
          >
            <template #prepend>
              <v-avatar :color="alertColorName(alert.type)" size="28" rounded="lg" variant="tonal" style="margin-top: 2px">
                <v-icon :icon="alertIcon(alert.type)" size="14" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-2 font-weight-bold" style="line-height: 1.3">
              {{ alert.patientName }}
              <v-icon icon="mdi-pin" size="12" color="primary" class="ml-1" style="vertical-align: middle" />
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption text-medium-emphasis" style="line-height: 1.4; white-space: normal">
              {{ alert.message }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-caption mt-1" style="opacity: 0.5; font-size: 0.65rem">
              {{ formatTime(alert.timestamp) }}
            </v-list-item-subtitle>
            <template #append>
              <v-menu location="bottom end">
                <template #activator="{ props: menuProps }">
                  <v-btn
                    v-bind="menuProps"
                    icon="mdi-dots-vertical"
                    size="x-small"
                    variant="text"
                    density="compact"
                    style="margin-top: 2px"
                  />
                </template>
                <v-list density="compact" min-width="180" rounded="0" class="py-1">
                  <v-list-item
                    prepend-icon="mdi-archive-outline"
                    title="Archive Alert"
                    @click="$emit('archive', alert.id)"
                  />
                  <v-list-item
                    prepend-icon="mdi-pin-off-outline"
                    title="Unpin Alert"
                    @click="$emit('pin', alert.id)"
                  />
                  <v-list-item
                    prepend-icon="mdi-open-in-new"
                    title="View Case Details"
                    @click="$emit('view-details', alert)"
                  />
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
        </v-list>

        <div v-if="pinnedAlerts.length === 0" class="text-center pa-8 text-medium-emphasis">
          <v-icon icon="mdi-pin-off-outline" size="40" class="mb-2" color="medium-emphasis" />
          <div class="text-body-2">No pinned alerts</div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
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
  pinned?: boolean
}

const props = defineProps<{
  alerts: Alert[]
  embedded?: boolean
}>()

defineEmits<{
  archive: [id: string]
  pin: [id: string]
  'view-snapshot': [alert: Alert]
  'view-details': [alert: Alert]
}>()

const selectedFilter = ref<string>('all')
const activeTab = ref('unread')

const unacknowledgedCount = computed(() =>
  props.alerts.filter((a) => !a.acknowledged).length
)

const unreadAlerts = computed(() =>
  props.alerts.filter((a) => !a.acknowledged)
)

const pinnedAlerts = computed(() =>
  [...unreadAlerts.value]
    .filter((a) => a.pinned)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
)

const filteredAlerts = computed(() => {
  const alerts = selectedFilter.value === 'all'
    ? unreadAlerts.value
    : unreadAlerts.value.filter((a) => a.type === selectedFilter.value)
  return [...alerts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
})

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
.alert-item :deep(.v-list-item__prepend) {
  align-self: flex-start;
  padding-top: 0px;
  margin-inline-end: 4px;
}
.alert-item :deep(.v-list-item__append) {
  align-self: flex-start;
  padding-top: 4px;
}
.alert-item :deep(.v-list-item__content) {
  padding-top: 4px;
}
.alert-item :deep(.v-list-item-subtitle) {
  -webkit-line-clamp: unset !important;
  overflow: visible !important;
}
.alerts-card {
  transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
}
</style>
