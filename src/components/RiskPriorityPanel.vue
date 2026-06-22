<template>
  <v-card variant="flat" class="risk-card pa-5" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
    <v-tabs v-model="activeTab" density="compact" color="primary" class="mb-4">
      <v-tab value="patients">Risk &amp; Priority</v-tab>
      <v-tab value="trends">Weekly Trends</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item value="patients">
    <div class="d-flex flex-wrap align-center gap-2 mb-4">
      <v-chip-group v-model="statusFilter" multiple selected-class="text-primary">
        <v-chip filter variant="tonal" value="open" size="small">Open {{ countByStatus('open') }}</v-chip>
        <v-chip filter variant="tonal" value="in-progress" size="small">In Progress {{ countByStatus('in-progress') }}</v-chip>
      </v-chip-group>
      <v-chip-group v-model="riskFilter" multiple selected-class="text-primary" class="ml-1">
        <v-chip filter variant="tonal" color="error" value="high" size="small">High Risk {{ countByRisk('high') }}</v-chip>
        <v-chip filter variant="tonal" color="warning" value="medium" size="small">Medium {{ countByRisk('medium') }}</v-chip>
        <v-chip filter variant="tonal" color="success" value="low" size="small">Low {{ countByRisk('low') }}</v-chip>
      </v-chip-group>
      <v-chip
        filter
        variant="tonal"
        color="error"
        size="small"
        :model-value="alertFilter"
        @click="alertFilter = !alertFilter"
      >
        Alerts {{ countAlerts() }}
      </v-chip>
      <v-spacer />
      <v-text-field
        v-model="search"
        density="compact"
        placeholder="Search Patient or Case"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
        style="max-width: 240px"
        variant="outlined"
        rounded="pill"
      />
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-refresh"
        @click="resetFilters"
      >
        Reset
      </v-btn>
    </div>

    <v-table density="comfortable" hover class="risk-table">
      <thead>
        <tr>
          <th class="text-left">Patient</th>
          <th class="text-left">Diagnosis</th>
          <th class="text-center">Risk</th>
          <th class="text-center">Status</th>
          <th class="text-center">Goals</th>
          <th class="text-left">Next Follow-Up</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in filteredCases"
          :key="item.case.id"
          :class="{ 'overdue-row': item.case.followUpOverdue, 'selected-row': selectedCase?.case.id === item.case.id }"
          style="cursor: pointer"
          @click="selectCase(item)"
        >
          <td>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ item.patient.lastName }}, {{ item.patient.firstName }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.case.id }} · {{ item.patient.age }}y · {{ item.patient.gender[0] }}
              </div>
            </div>
          </td>
          <td>
            <div class="text-body-2" style="max-width: 180px">
              {{ item.patient.primaryDiagnosis }}
            </div>
          </td>
          <td class="text-center">
            <v-chip
              :color="riskColor(item.patient.riskLevel)"
              size="small"
              variant="flat"
              class="font-weight-medium"
            >
              {{ item.patient.riskScore }}
            </v-chip>
          </td>
          <td class="text-center">
            <v-chip
              :color="statusColor(item.case.status)"
              size="small"
              variant="tonal"
            >
              {{ item.case.status === 'in-progress' ? 'In Progress' : 'Open' }}
            </v-chip>
          </td>
          <td class="text-center">
            <span class="text-body-2">
              {{ item.case.goalsAchieved }}/{{ item.case.totalGoals }}
            </span>
          </td>
          <td>
            <div>
              <div class="d-flex align-center">
                <span
                  class="text-body-2 font-weight-medium"
                  :class="item.case.followUpOverdue ? 'text-error font-weight-bold' : (!hasInfoAlert(item.patient.id) && item.case.daysSinceLastContact >= 3) ? 'text-warning font-weight-bold' : ''"
                >
                  {{ formatDate(item.case.nextFollowUpDate) }}
                </span>
                <v-icon
                  v-if="item.case.followUpOverdue"
                  icon="mdi-alert-circle"
                  color="error"
                  size="16"
                  class="ml-2"
                />
                <v-icon
                  v-if="!item.case.followUpOverdue && item.case.daysSinceLastContact >= 3 && !hasInfoAlert(item.patient.id)"
                  icon="mdi-alert"
                  color="warning"
                  size="16"
                  class="ml-2"
                />
                <v-icon
                  v-if="!item.case.followUpOverdue && hasInfoAlert(item.patient.id)"
                  icon="mdi-information"
                  color="info"
                  size="16"
                  class="ml-2"
                />
              </div>
              <div
                class="text-caption"
                :class="item.case.daysSinceLastContact >= 5 ? 'text-error' : item.case.daysSinceLastContact >= 3 ? 'text-warning' : 'text-medium-emphasis'"
              >
                {{ item.case.daysSinceLastContact }}d since last contact
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="filteredCases.length === 0" class="text-center pa-8 text-medium-emphasis">
      <v-icon icon="mdi-filter-off-outline" size="48" class="mb-2" />
      <div class="text-body-1">No cases match your filters</div>
    </div>
      </v-tabs-window-item>

      <v-tabs-window-item value="trends">
        <TrendChart v-if="trend" :trend="trend" embedded />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TrendChart from './TrendChart.vue'

interface Patient {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  primaryDiagnosis: string
  comorbidities: string[]
  insurance: string
  primaryCareProvider: string
  phone: string
  address: string
  riskScore: number
  riskLevel: string
}

interface Case {
  id: string
  patientId: string
  status: string
  priority: string
  lastContactDate: string
  daysSinceLastContact: number
  nextFollowUpDate: string
  followUpOverdue: boolean
  careGoals: string[]
  goalsAchieved: number
  totalGoals: number
  barriers: string[]
  barriersResolved: number
  notes: string
}

interface Activity {
  id: string
  caseId: string
  type: string
  date: string
  duration: number
  outcome: string
}

interface CaseWithPatient {
  case: Case
  patient: Patient
}

const props = defineProps<{
  cases: Case[]
  patients: Patient[]
  activities: Activity[]
  alerts?: { id: string; type: string; patientId: string; message: string }[]
  trend?: any
}>()

const emit = defineEmits<{
  select: [item: CaseWithPatient | null]
}>()

const activeTab = ref('patients')

const search = ref('')
const statusFilter = ref<string[]>([])
const riskFilter = ref<string[]>([])
const selectedCase = ref<CaseWithPatient | null>(null)
const alertFilter = ref(false)

function resetFilters() {
  search.value = ''
  statusFilter.value = []
  riskFilter.value = []
  alertFilter.value = false
  selectedCase.value = null
}

function countByStatus(status: string) {
  return casePatientPairs.value.filter(item => item.case.status === status).length
}

function countByRisk(level: string) {
  return casePatientPairs.value.filter(item => item.patient.riskLevel === level).length
}

function countAlerts() {
  return casePatientPairs.value.filter(item => item.case.followUpOverdue).length
}

function hasInfoAlert(patientId: string) {
  return props.alerts?.some(a => a.patientId === patientId && a.type === 'info') ?? false
}

function selectCase(item: CaseWithPatient) {
  selectedCase.value = selectedCase.value?.case.id === item.case.id ? null : item
  emit('select', selectedCase.value)
}

const casePatientPairs = computed<CaseWithPatient[]>(() => {
  return props.cases
    .map((c) => {
      const patient = props.patients.find((p) => p.id === c.patientId)
      return patient ? { case: c, patient } : null
    })
    .filter((x): x is CaseWithPatient => x !== null)
    .sort((a, b) => b.patient.riskScore - a.patient.riskScore)
})

const filteredCases = computed(() => {
  return casePatientPairs.value.filter((item) => {
    if (statusFilter.value.length > 0 && !statusFilter.value.includes(item.case.status)) return false
    if (riskFilter.value.length > 0 && !riskFilter.value.includes(item.patient.riskLevel)) return false
    if (alertFilter.value && !item.case.followUpOverdue) return false
    if (search.value) {
      const s = search.value.toLowerCase()
      const name = `${item.patient.firstName} ${item.patient.lastName}`.toLowerCase()
      const dx = item.patient.primaryDiagnosis.toLowerCase()
      const caseId = item.case.id.toLowerCase()
      if (!name.includes(s) && !dx.includes(s) && !caseId.includes(s)) return false
    }
    return true
  })
})

function riskColor(level: string) {
  if (level === 'high') return 'error'
  if (level === 'medium') return 'warning'
  return 'success'
}

function statusColor(status: string) {
  if (status === 'open') return 'warning'
  return 'info'
}

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
.overdue-row {
  background: rgba(var(--v-theme-error), 0.04) !important;
}
.selected-row {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}
.risk-table th {
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.5) !important;
  border-bottom: 1px solid rgba(var(--v-theme-outline-variant), 0.5) !important;
}
.risk-table td {
  border-bottom: 1px solid rgba(var(--v-theme-outline-variant), 0.3) !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
.risk-card {
  transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
}
</style>
