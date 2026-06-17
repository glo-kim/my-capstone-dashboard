<template>
  <v-card class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="text-subtitle-1 font-weight-bold">Caseload Breakdown</div>
      <v-icon icon="mdi-folder-multiple-outline" color="primary" size="20" />
    </div>

    <div class="d-flex align-center gap-3 mb-4">
      <div class="flex-grow-1">
        <div class="d-flex justify-space-between text-body-2 mb-1">
          <span>Capacity</span>
          <span class="font-weight-medium">{{ summary.totalActiveCases }} / {{ coordinator.activeCaseLimit }}</span>
        </div>
        <v-progress-linear
          :model-value="(summary.totalActiveCases / coordinator.activeCaseLimit) * 100"
          color="primary"
          rounded
          height="8"
        />
      </div>
    </div>

    <v-list density="compact" class="pa-0">
      <v-list-item class="px-0">
        <template #prepend>
          <v-avatar size="32" color="warning" variant="tonal" rounded="lg">
            <v-icon icon="mdi-folder-open-outline" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">Open</v-list-item-title>
        <template #append>
          <span class="text-h6 font-weight-bold">{{ summary.openCases }}</span>
        </template>
      </v-list-item>
      <v-list-item class="px-0">
        <template #prepend>
          <v-avatar size="32" color="info" variant="tonal" rounded="lg">
            <v-icon icon="mdi-progress-clock" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">In Progress</v-list-item-title>
        <template #append>
          <span class="text-h6 font-weight-bold">{{ summary.inProgressCases }}</span>
        </template>
      </v-list-item>
      <v-list-item class="px-0">
        <template #prepend>
          <v-avatar size="32" color="success" variant="tonal" rounded="lg">
            <v-icon icon="mdi-check-circle-outline" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">Closed (This Month)</v-list-item-title>
        <template #append>
          <span class="text-h6 font-weight-bold">{{ summary.closedThisMonth }}</span>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="my-4" />

    <div class="text-subtitle-1 font-weight-bold mb-3">Activity This Week</div>

    <v-list density="compact" class="pa-0">
      <v-list-item class="px-0">
        <template #prepend>
          <v-avatar size="32" color="primary" variant="tonal" rounded="lg">
            <v-icon icon="mdi-phone-outline" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">Phone Calls</v-list-item-title>
        <template #append>
          <span class="font-weight-bold">{{ activitySummary.thisWeek.phoneCalls }}</span>
        </template>
      </v-list-item>
      <v-list-item class="px-0">
        <template #prepend>
          <v-avatar size="32" color="tertiary" variant="tonal" rounded="lg">
            <v-icon icon="mdi-home-account" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">Home Visits</v-list-item-title>
        <template #append>
          <span class="font-weight-bold">{{ activitySummary.thisWeek.homeVisits }}</span>
        </template>
      </v-list-item>
      <v-list-item class="px-0">
        <template #prepend>
          <v-avatar size="32" color="secondary" variant="tonal" rounded="lg">
            <v-icon icon="mdi-swap-horizontal" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">Coordination Tasks</v-list-item-title>
        <template #append>
          <span class="font-weight-bold">{{ activitySummary.thisWeek.coordinationTasks }}</span>
        </template>
      </v-list-item>
      <v-list-item class="px-0">
        <template #prepend>
          <v-avatar size="32" color="primary" variant="tonal" rounded="lg">
            <v-icon icon="mdi-clock-outline" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">Contact Minutes</v-list-item-title>
        <template #append>
          <span class="font-weight-bold">{{ activitySummary.thisWeek.totalContactMinutes }}</span>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="my-4" />

    <div class="text-subtitle-1 font-weight-bold mb-3">Outcomes</div>

    <div
      v-for="(value, key) in goalCompletion"
      :key="key"
      class="mb-3"
    >
      <div class="d-flex justify-space-between text-body-2 mb-1">
        <span>{{ formatGoalLabel(key as string) }}</span>
        <span class="font-weight-medium">{{ Math.round(value * 100) }}%</span>
      </div>
      <v-progress-linear
        :model-value="value * 100"
        :color="value >= 0.7 ? 'success' : value >= 0.5 ? 'warning' : 'error'"
        rounded
        height="6"
      />
    </div>

    <div class="d-flex align-center mt-4 pa-3 rounded-xl" style="background: rgb(var(--v-theme-surface-variant), 0.3)">
      <v-icon icon="mdi-hospital-building" size="20" class="mr-2" color="primary" />
      <div>
        <div class="text-body-2 font-weight-medium">Readmission Rate</div>
        <div class="text-body-2 text-medium-emphasis">
          {{ Math.round(readmissionStats.last30Days.rate * 100) }}% yours vs {{ Math.round(readmissionStats.nationalAverage * 100) }}% national
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
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
}>()

function formatGoalLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
}
</script>
