<template>
  <component :is="embedded ? 'div' : 'v-card'" v-bind="!embedded ? { variant: 'flat', class: 'caseload-card pa-5', style: 'background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)' } : {}">
    <!-- Section: Caseload -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="section-title">Caseload</div>
      <v-chip size="x-small" color="primary" variant="tonal">{{ summary.totalActiveCases }} active</v-chip>
    </div>

    <div class="mb-4">
      <div class="d-flex justify-space-between text-body-2 mb-2">
        <span class="text-medium-emphasis">Capacity</span>
        <span class="font-weight-bold">{{ summary.totalActiveCases }}<span class="text-medium-emphasis font-weight-regular"> / {{ coordinator.activeCaseLimit }}</span></span>
      </div>
      <v-progress-linear
        :model-value="(summary.totalActiveCases / coordinator.activeCaseLimit) * 100"
        color="primary"
        bg-color="primary"
        bg-opacity="0.12"
        rounded
        height="10"
      />
    </div>

    <div class="status-grid mb-2">
      <div class="status-item">
        <v-avatar size="36" color="warning-container" rounded="lg">
          <v-icon icon="mdi-folder-open-outline" size="18" color="warning" />
        </v-avatar>
        <div class="ml-3">
          <div class="text-h6 font-weight-bold" style="line-height: 1.2">{{ summary.openCases }}</div>
          <div class="text-caption text-medium-emphasis">Open</div>
        </div>
      </div>
      <div class="status-item">
        <v-avatar size="36" color="info-container" rounded="lg">
          <v-icon icon="mdi-progress-clock" size="18" color="info" />
        </v-avatar>
        <div class="ml-3">
          <div class="text-h6 font-weight-bold" style="line-height: 1.2">{{ summary.inProgressCases }}</div>
          <div class="text-caption text-medium-emphasis">In Progress</div>
        </div>
      </div>
      <div class="status-item">
        <v-avatar size="36" color="success-container" rounded="lg">
          <v-icon icon="mdi-check-circle-outline" size="18" color="success" />
        </v-avatar>
        <div class="ml-3">
          <div class="text-h6 font-weight-bold" style="line-height: 1.2">{{ summary.closedThisMonth }}</div>
          <div class="text-caption text-medium-emphasis">Closed</div>
        </div>
      </div>
    </div>

    <v-divider class="my-5" />

    <!-- Section: Activity -->
    <div class="section-title mb-4">Activity This Week</div>

    <div class="activity-grid">
      <div class="activity-item" v-for="item in activityItems" :key="item.label">
        <v-avatar size="32" :color="item.color" variant="tonal" rounded="lg">
          <v-icon :icon="item.icon" size="16" />
        </v-avatar>
        <div class="ml-3 flex-grow-1">
          <div class="text-caption text-medium-emphasis">{{ item.label }}</div>
        </div>
        <div class="text-body-1 font-weight-bold">{{ item.value }}</div>
      </div>
    </div>

    <v-divider class="my-5" />

    <!-- Section: Goal Completion -->
    <div class="section-title mb-4">Goal Completion</div>

    <div
      v-for="(value, key) in goalCompletion"
      :key="key"
      class="mb-3"
    >
      <div class="d-flex justify-space-between mb-1">
        <span class="text-caption text-medium-emphasis">{{ formatGoalLabel(key as string) }}</span>
        <span class="text-caption font-weight-bold">{{ Math.round(value * 100) }}%</span>
      </div>
      <v-progress-linear
        :model-value="value * 100"
        :color="value >= 0.7 ? 'success' : value >= 0.5 ? 'warning' : 'error'"
        :bg-color="value >= 0.7 ? 'success' : value >= 0.5 ? 'warning' : 'error'"
        bg-opacity="0.1"
        rounded
        height="6"
      />
    </div>

    <!-- Readmission callout -->
    <v-sheet
      color="primary-container"
      rounded="xl"
      class="pa-4 mt-5 d-flex align-center"
    >
      <v-avatar color="primary" size="36" rounded="lg">
        <v-icon icon="mdi-hospital-building" size="18" color="on-primary" />
      </v-avatar>
      <div class="ml-3">
        <div class="text-body-2 font-weight-bold" style="color: rgb(var(--v-theme-on-primary-container))">
          {{ Math.round(readmissionStats.last30Days.rate * 100) }}% Readmission
        </div>
        <div class="text-caption" style="color: rgb(var(--v-theme-on-primary-container)); opacity: 0.7">
          vs {{ Math.round(readmissionStats.nationalAverage * 100) }}% national avg
        </div>
      </div>
    </v-sheet>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  summary: {
    totalActiveCases: number
    openCases: number
    inProgressCases: number
    closedThisMonth: number
  }
  coordinator: {
    activeCaseLimit: number
  }
  activitySummary: {
    thisWeek: {
      phoneCalls: number
      homeVisits: number
      coordinationTasks: number
      documentationTasks: number
      totalContactMinutes: number
    }
  }
  goalCompletion: Record<string, number>
  readmissionStats: {
    last30Days: { rate: number }
    nationalAverage: number
  }
  embedded?: boolean
}>()

const activityItems = computed(() => [
  { label: 'Phone Calls', value: props.activitySummary.thisWeek.phoneCalls, icon: 'mdi-phone-outline', color: 'primary' },
  { label: 'Home Visits', value: props.activitySummary.thisWeek.homeVisits, icon: 'mdi-home-account', color: 'tertiary' },
  { label: 'Coordination', value: props.activitySummary.thisWeek.coordinationTasks, icon: 'mdi-swap-horizontal', color: 'secondary' },
  { label: 'Contact Mins', value: props.activitySummary.thisWeek.totalContactMinutes, icon: 'mdi-clock-outline', color: 'info' },
])

function formatGoalLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
}
</script>

<style scoped>
.caseload-card {
  transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
}
.section-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.status-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.status-item {
  display: flex;
  align-items: center;
}
.activity-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.activity-item {
  display: flex;
  align-items: center;
}
</style>
