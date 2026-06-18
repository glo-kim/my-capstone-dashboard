<template>
  <v-layout>
    <v-main>
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
      <div class="d-flex align-center gap-2">
        <v-btn
          prepend-icon="mdi-plus"
          variant="flat"
          color="primary"
          size="small"
        >
          Create New Case
        </v-btn>
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

    <!-- Second Row: Cases (tabbed) + Risk & Priority, Alerts below Risk -->
    <v-row>
      <v-col cols="12" md="4">
        <!-- Alerts (collapsible) -->
        <v-card variant="flat" class="mb-4" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
          <v-card-title
            class="d-flex align-center pa-4"
            style="cursor: pointer; min-height: 48px"
            @click="alertsExpanded = !alertsExpanded"
          >
            <span class="section-title" style="margin: 0; line-height: 1; align-self: center; display: inline-flex; align-items: center; height: 24px">Alerts</span>
            <v-badge
              v-if="unacknowledgedAlertCount > 0"
              :content="unacknowledgedAlertCount"
              color="error"
              inline
              class="ml-2"
            />
            <v-spacer />
            <v-icon :icon="alertsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="20" />
          </v-card-title>
          <v-expand-transition>
            <div v-show="alertsExpanded" class="px-4 pb-4">
              <AlertsPanel
                :alerts="alerts"
                embedded
                @acknowledge="acknowledgeAlert"
              />
            </div>
          </v-expand-transition>
        </v-card>

        <!-- Caseload tabbed card -->
        <v-card variant="flat" class="pa-5" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
          <v-tabs v-model="casesTab" density="compact" color="primary" class="mb-4">
            <v-tab value="active">Active Cases</v-tab>
            <v-tab value="closed">Closed Cases</v-tab>
          </v-tabs>

          <v-tabs-window v-model="casesTab">
            <v-tabs-window-item value="active">
              <CaseloadPanel
                :summary="data.summary"
                :coordinator="data.coordinator"
                :activity-summary="data.activitySummary"
                :goal-completion="data.outcomes.goalCompletionByCategory"
                :readmission-stats="data.outcomes.readmissionStats"
                embedded
              />
            </v-tabs-window-item>

            <v-tabs-window-item value="closed">
              <div
                v-for="(closed, index) in data.outcomes.closedCasesThisMonth"
                :key="closed.caseId"
              >
                <v-divider v-if="index > 0" class="my-3" />
                <div class="d-flex align-center">
                  <v-avatar
                    :color="closed.readmitted ? 'error-container' : 'success-container'"
                    size="32"
                    rounded="lg"
                    class="mr-4"
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
                  </div>
                  <span class="text-caption text-medium-emphasis" style="white-space: nowrap; margin-left: auto">{{ formatDate(closed.closedDate) }}</span>
                </div>
                <div style="margin-left: 48px">
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
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <RiskPriorityPanel
          :cases="data.cases"
          :patients="data.patients"
          :activities="data.activities"
          :trend="data.weeklyTrend"
          @select="onCaseSelect"
        />
      </v-col>
    </v-row>
  </v-container>
    </v-main>

    <!-- Case Detail Drawer -->
    <v-navigation-drawer
      v-model="drawerOpen"
      location="right"
      width="400"
      temporary
      style="height: 100vh; top: 0"
    >
      <div v-if="selectedCase" class="d-flex flex-column" style="height: 100vh">
        <!-- Sticky header -->
        <div class="pa-5 pb-0" style="flex-shrink: 0; position: sticky; top: 0; z-index: 1; background: rgb(var(--v-theme-surface))">
          <div class="d-flex align-center justify-space-between mb-1">
            <div class="text-subtitle-1 font-weight-bold">
              {{ selectedCase.patient.firstName }} {{ selectedCase.patient.lastName }}
              <v-chip size="x-small" :color="riskColor(selectedCase.patient.riskLevel)" variant="flat" class="ml-2">
                Risk {{ selectedCase.patient.riskScore }}
              </v-chip>
            </div>
            <v-btn icon="mdi-close" size="small" variant="text" @click="drawerOpen = false" />
          </div>
          <div class="text-caption text-medium-emphasis mb-4">
            {{ selectedCase.case.id }} · {{ selectedCase.patient.age }}y · {{ selectedCase.patient.gender }}
          </div>

          <v-tabs v-model="drawerTab" density="compact" color="primary">
            <v-tab value="care">Care Activity</v-tab>
            <v-tab value="info">Patient Info</v-tab>
          </v-tabs>
        </div>

        <!-- Scrollable content -->
        <div class="px-5 pt-4 pb-5" style="flex: 1; overflow-y: auto">
          <v-tabs-window v-model="drawerTab">
          <!-- Tab 1: Patient Information -->
          <v-tabs-window-item value="info">
            <div class="mb-4">
              <div class="section-title mb-2">Main Information</div>
              <div class="text-body-2"><span class="font-weight-medium">Mobile:</span> {{ selectedCase.patient.phone }}</div>
              <div class="text-body-2 mt-1">{{ selectedCase.patient.address }}</div>
              <div class="text-body-2 mt-1">Insurance: {{ selectedCase.patient.insurance }}</div>
            </div>

            <v-divider class="mb-4" />

            <div class="mb-4">
              <div class="section-title mb-2">Provider Contact</div>
              <div class="text-body-2 font-weight-medium">{{ selectedCase.patient.primaryCareProvider }}</div>
              <div class="text-body-2 mt-1"><span class="font-weight-medium">Office:</span> (503) 555-0100</div>
              <div class="text-body-2 mt-1"><span class="font-weight-medium">Email:</span> {{ selectedCase.patient.primaryCareProvider.split(' ').pop()?.toLowerCase() }}@evergreenhealth.org</div>
              <div class="text-body-2 mt-1"><span class="font-weight-medium">Location:</span> Evergreen Health Clinic, Portland, OR</div>
            </div>

            <v-divider class="mb-4" />

            <div class="mb-4">
              <div class="section-title mb-2">Comorbidities</div>
              <v-chip
                v-for="c in selectedCase.patient.comorbidities"
                :key="c"
                size="x-small"
                variant="tonal"
                class="mr-1 mb-1"
              >
                {{ c }}
              </v-chip>
              <div v-if="selectedCase.patient.comorbidities.length === 0" class="text-body-2 text-medium-emphasis">None</div>
            </div>

            <div>
              <v-divider class="mb-4" />
              <div class="section-title mb-2">Barriers</div>
              <v-chip
                v-for="b in selectedCase.case.barriers"
                :key="b"
                size="small"
                color="warning"
                variant="tonal"
                class="mr-1 mb-1"
              >
                {{ b }}
              </v-chip>
            </div>

          </v-tabs-window-item>

          <!-- Tab 2: Care Activity -->
          <v-tabs-window-item value="care">
            <div v-if="patientAlerts(selectedCase.patient.id).length > 0" class="mb-4">
              <div class="section-title mb-2">Alerts</div>
              <v-sheet
                v-for="alert in patientAlerts(selectedCase.patient.id)"
                :key="alert.id"
                :color="alert.type === 'critical' ? 'error-container' : alert.type === 'warning' ? 'warning-container' : 'info-container'"
                rounded="lg"
                class="pa-3 mb-2"
                :style="{ borderLeft: `3px solid rgb(var(--v-theme-${alert.type === 'critical' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}))` }"
              >
                <div class="d-flex align-center mb-1">
                  <v-icon
                    :icon="alert.type === 'critical' ? 'mdi-alert-circle' : alert.type === 'warning' ? 'mdi-alert' : 'mdi-information'"
                    :color="alert.type === 'critical' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'"
                    size="16"
                    class="mr-2"
                  />
                  <span class="text-caption font-weight-bold text-uppercase">{{ alert.type }}</span>
                </div>
                <div class="text-body-2">{{ alert.message }}</div>
              </v-sheet>
            </div>

            <v-divider v-if="patientAlerts(selectedCase.patient.id).length > 0" class="mb-4" />

            <div class="mb-4">
              <div class="section-title mb-2">Care Goals</div>
              <div v-for="(goal, i) in selectedCase.case.careGoals" :key="i" class="d-flex align-center mb-1">
                <v-icon
                  :icon="i < selectedCase.case.goalsAchieved ? 'mdi-check-circle' : 'mdi-circle-outline'"
                  :color="i < selectedCase.case.goalsAchieved ? 'success' : 'grey'"
                  size="16"
                  class="mr-3"
                />
                <span class="text-body-2">{{ goal }}</span>
              </div>
            </div>

            <v-divider class="mb-4" />

            <div class="mb-4">
              <div class="section-title mb-2">Latest Notes</div>
              <div class="text-body-2">{{ selectedCase.case.notes }}</div>
            </div>

            <v-divider class="mb-4" />

            <div>
              <div class="section-title mb-2">Recent Activity</div>
              <div
                v-for="act in caseActivities(selectedCase.case.id)"
                :key="act.id"
                class="mb-3"
              >
                <div class="d-flex align-center mb-1">
                  <span class="text-caption text-medium-emphasis">{{ formatDate(act.date) }}</span>
                  <span style="margin-left: auto" class="d-flex align-center">
                    <v-icon :icon="activityIcon(act.type)" size="14" color="primary" class="mr-3" />
                    <span class="text-caption" style="color: rgb(var(--v-theme-primary))">{{ activityLabel(act.type) }}</span>
                  </span>
                </div>
                <div class="text-body-2">{{ act.outcome }}</div>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
        </div>
      </div>
    </v-navigation-drawer>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import metricsData from '../data/metrics.json'

import KpiCard from '../components/KpiCard.vue'
import CaseloadPanel from '../components/CaseloadPanel.vue'
import RiskPriorityPanel from '../components/RiskPriorityPanel.vue'
import AlertsPanel from '../components/AlertsPanel.vue'

const data = metricsData

const alerts = ref([...data.alerts])
const drawerOpen = ref(false)

watch(drawerOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})
const selectedCase = ref<any>(null)
const casesTab = ref('active')
const alertsExpanded = ref(false)
const drawerTab = ref('care')

const unacknowledgedAlertCount = computed(() =>
  alerts.value.filter((a: any) => !a.acknowledged).length
)

function onCaseSelect(item: any) {
  if (item) {
    selectedCase.value = item
    drawerOpen.value = true
  } else {
    drawerOpen.value = false
    selectedCase.value = null
  }
}

function acknowledgeAlert(id: string) {
  const alert = alerts.value.find((a) => a.id === id)
  if (alert) alert.acknowledged = true
}

function patientAlerts(patientId: string) {
  return alerts.value.filter((a: any) => a.patientId === patientId && !a.acknowledged)
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

function riskColor(level: string) {
  if (level === 'high') return 'error'
  if (level === 'medium') return 'warning'
  return 'success'
}

function caseActivities(caseId: string) {
  return data.activities
    .filter((a: any) => a.caseId === caseId)
    .sort((a: any, b: any) => b.date.localeCompare(a.date))
    .slice(0, 4)
}

function activityIcon(type: string) {
  const map: Record<string, string> = {
    'phone-call': 'mdi-phone-outline',
    'home-visit': 'mdi-home-account',
    'coordination': 'mdi-swap-horizontal',
    'documentation': 'mdi-file-document-outline',
  }
  return map[type] || 'mdi-circle-small'
}

function activityLabel(type: string) {
  const map: Record<string, string> = {
    'phone-call': 'Phone Call',
    'home-visit': 'Home Visit',
    'coordination': 'Coordination',
    'documentation': 'Documentation',
  }
  return map[type] || type
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
