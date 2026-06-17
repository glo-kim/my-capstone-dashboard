<template>
  <v-container fluid class="pa-5 pa-md-8">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold" style="letter-spacing: -0.02em; line-height: 1.2">
          Good {{ greeting }}, {{ data.coordinator.name.split(' ')[0] }}
        </h1>
        <div class="text-body-2 text-medium-emphasis mt-2" style="letter-spacing: 0.01em">
          {{ todayFormatted }} · <span class="font-weight-medium">{{ data.summary.totalActiveCases }} active cases</span>
        </div>
      </div>
      <v-btn
        :icon="darkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
        variant="tonal"
        color="secondary"
        size="small"
        @click="toggleTheme"
      />
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
        <v-card variant="flat" class="pa-5 mt-4" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
          <div class="section-title mb-4">Recently Closed</div>
          <div
            v-for="closed in data.outcomes.closedCasesThisMonth"
            :key="closed.caseId"
            class="d-flex align-center gap-3 mb-3"
          >
            <v-avatar
              :color="closed.readmitted ? 'error-container' : 'success-container'"
              size="32"
              rounded="lg"
            >
              <v-icon
                :icon="closed.readmitted ? 'mdi-hospital-building' : 'mdi-check-circle'"
                :color="closed.readmitted ? 'error' : 'success'"
                size="16"
              />
            </v-avatar>
            <div class="flex-grow-1" style="min-width: 0">
              <div class="text-body-2 font-weight-medium text-truncate">
                {{ closed.patientName }}
              </div>
              <div class="text-caption text-medium-emphasis text-truncate">
                {{ closed.diagnosis }}
                <v-chip
                  v-if="closed.readmitted"
                  size="x-small"
                  color="error"
                  variant="tonal"
                  class="ml-1"
                >
                  Readmitted
                </v-chip>
              </div>
            </div>
            <span class="text-caption text-medium-emphasis" style="white-space: nowrap">{{ formatDate(closed.closedDate) }}</span>
          </div>
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

<style scoped>
.section-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
</style>
