<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold">
          Good {{ greeting }}, {{ data.coordinator.name.split(' ')[0] }}
        </h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ todayFormatted }} · {{ data.summary.totalActiveCases }} active cases
        </div>
      </div>
      <div class="d-flex align-center gap-2">
        <v-btn
          :icon="darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="tonal"
          size="small"
          @click="toggleTheme"
        />
      </div>
    </div>

    <!-- KPI Row -->
    <v-row class="mb-2">
      <v-col cols="6" sm="4" md="2">
        <KpiCard
          :value="data.summary.totalActiveCases"
          label="Active Cases"
          icon="mdi-folder-account-outline"
          color="primary"
          :trend="4"
          trend-direction="up-bad"
        />
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <KpiCard
          :value="data.summary.highRiskPatients"
          label="High Risk"
          icon="mdi-alert-circle-outline"
          color="error"
          :trend="-14"
          trend-direction="up-bad"
        />
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <KpiCard
          :value="data.summary.overdueFollowUps"
          label="Overdue Follow-Ups"
          icon="mdi-clock-alert-outline"
          color="warning"
          :trend="33"
          trend-direction="up-bad"
        />
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <KpiCard
          :value="data.summary.goalsAchievedRate"
          label="Goals Achieved"
          icon="mdi-target"
          color="success"
          :is-percent="true"
          :trend="5"
        />
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <KpiCard
          :value="data.summary.readmissionRate"
          label="Readmission Rate"
          icon="mdi-hospital-building"
          color="tertiary"
          :is-percent="true"
          :trend="-8"
        />
      </v-col>
      <v-col cols="6" sm="4" md="2">
        <KpiCard
          :value="data.summary.avgDaysSinceLastContact"
          label="Avg Days Since Contact"
          icon="mdi-phone-clock"
          color="secondary"
          :trend="-6"
        />
      </v-col>
    </v-row>

    <!-- Main 3-Column Layout -->
    <v-row>
      <!-- Left Column: Caseload & Activity -->
      <v-col cols="12" lg="3" order="2" order-lg="1">
        <CaseloadPanel
          :summary="data.summary"
          :coordinator="data.coordinator"
          :activity-summary="data.activitySummary"
          :goal-completion="data.outcomes.goalCompletionByCategory"
          :readmission-stats="data.outcomes.readmissionStats"
        />
      </v-col>

      <!-- Center Column: Risk & Priority (primary focus) -->
      <v-col cols="12" lg="6" order="1" order-lg="2">
        <RiskPriorityPanel
          :cases="data.cases"
          :patients="data.patients"
          :activities="data.activities"
        />

        <!-- Trend Chart below risk table -->
        <div class="mt-4">
          <TrendChart :trend="data.weeklyTrend" />
        </div>
      </v-col>

      <!-- Right Column: Alerts -->
      <v-col cols="12" lg="3" order="3">
        <AlertsPanel
          :alerts="alerts"
          @acknowledge="acknowledgeAlert"
        />

        <!-- Recent Closures -->
        <v-card class="pa-4 mt-4">
          <div class="text-subtitle-1 font-weight-bold mb-3">Recently Closed</div>
          <v-list density="compact" class="pa-0">
            <v-list-item
              v-for="closed in data.outcomes.closedCasesThisMonth"
              :key="closed.caseId"
              class="px-0"
            >
              <template #prepend>
                <v-avatar
                  :color="closed.readmitted ? 'error' : 'success'"
                  variant="tonal"
                  size="28"
                  rounded="lg"
                >
                  <v-icon
                    :icon="closed.readmitted ? 'mdi-hospital-building' : 'mdi-check'"
                    size="16"
                  />
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2">
                {{ closed.patientName }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ closed.diagnosis }}
                <v-chip
                  v-if="closed.readmitted"
                  size="x-small"
                  color="error"
                  variant="flat"
                  class="ml-1"
                >
                  Readmitted
                </v-chip>
              </v-list-item-subtitle>
              <template #append>
                <span class="text-caption text-medium-emphasis">{{ formatDate(closed.closedDate) }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import metricsData from '../data/metrics.json'

import KpiCard from '../components/KpiCard.vue'
import CaseloadPanel from '../components/CaseloadPanel.vue'
import RiskPriorityPanel from '../components/RiskPriorityPanel.vue'
import AlertsPanel from '../components/AlertsPanel.vue'
import TrendChart from '../components/TrendChart.vue'

const theme = useTheme()
const darkMode = ref(false)

const data = metricsData

const alerts = ref([...data.alerts])

function toggleTheme() {
  darkMode.value = !darkMode.value
  theme.global.name.value = darkMode.value ? 'md3Dark' : 'md3Light'
}

function acknowledgeAlert(id: string) {
  const alert = alerts.value.find((a) => a.id === id)
  if (alert) alert.acknowledged = true
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
})

const todayFormatted = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
)

function formatDate(date: string) {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
