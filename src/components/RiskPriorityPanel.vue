<template>
  <v-card class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="text-subtitle-1 font-weight-bold">Risk &amp; Priority</div>
      <div class="d-flex gap-2">
        <v-text-field
          v-model="search"
          density="compact"
          placeholder="Search patients..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          style="max-width: 220px"
          variant="outlined"
        />
      </div>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-4">
      <v-chip-group v-model="statusFilter" multiple>
        <v-chip filter variant="outlined" value="open" size="small">Open</v-chip>
        <v-chip filter variant="outlined" value="in-progress" size="small">In Progress</v-chip>
      </v-chip-group>
      <v-chip-group v-model="riskFilter" multiple class="ml-2">
        <v-chip filter variant="outlined" color="error" value="high" size="small">High Risk</v-chip>
        <v-chip filter variant="outlined" color="warning" value="medium" size="small">Medium</v-chip>
        <v-chip filter variant="outlined" color="success" value="low" size="small">Low</v-chip>
      </v-chip-group>
    </div>

    <v-table density="comfortable" hover class="risk-table">
      <thead>
        <tr>
          <th class="text-left">Patient</th>
          <th class="text-left">Diagnosis</th>
          <th class="text-center">Risk</th>
          <th class="text-center">Status</th>
          <th class="text-center">Days Since Contact</th>
          <th class="text-center">Goals</th>
          <th class="text-left">Next Follow-Up</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in filteredCases"
          :key="item.case.id"
          :class="{ 'overdue-row': item.case.followUpOverdue }"
          style="cursor: pointer"
          @click="selectedCase = selectedCase?.case.id === item.case.id ? null : item"
        >
          <td>
            <div class="d-flex align-center gap-2">
              <v-avatar
                :color="riskColor(item.patient.riskLevel)"
                size="32"
                variant="tonal"
              >
                <span class="text-caption font-weight-bold">
                  {{ item.patient.firstName[0] }}{{ item.patient.lastName[0] }}
                </span>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ item.patient.lastName }}, {{ item.patient.firstName }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.patient.age }}y · {{ item.patient.gender[0] }}
                </div>
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
            <span
              class="font-weight-bold"
              :class="item.case.daysSinceLastContact >= 5 ? 'text-error' : item.case.daysSinceLastContact >= 3 ? 'text-warning' : ''"
            >
              {{ item.case.daysSinceLastContact }}d
            </span>
          </td>
          <td class="text-center">
            <span class="text-body-2">
              {{ item.case.goalsAchieved }}/{{ item.case.totalGoals }}
            </span>
          </td>
          <td>
            <div class="d-flex align-center gap-1">
              <v-icon
                v-if="item.case.followUpOverdue"
                icon="mdi-alert-circle"
                color="error"
                size="16"
              />
              <span
                class="text-body-2"
                :class="{ 'text-error font-weight-bold': item.case.followUpOverdue }"
              >
                {{ formatDate(item.case.nextFollowUpDate) }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="filteredCases.length === 0" class="text-center pa-8 text-medium-emphasis">
      <v-icon icon="mdi-filter-off-outline" size="48" class="mb-2" />
      <div class="text-body-1">No cases match your filters</div>
    </div>

    <!-- Expandable detail panel -->
    <v-expand-transition>
      <v-sheet
        v-if="selectedCase"
        color="surface-variant"
        rounded="xl"
        class="pa-4 mt-4"
      >
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="text-subtitle-1 font-weight-bold">
            {{ selectedCase.patient.firstName }} {{ selectedCase.patient.lastName }}
            <v-chip size="x-small" :color="riskColor(selectedCase.patient.riskLevel)" variant="flat" class="ml-2">
              Risk {{ selectedCase.patient.riskScore }}
            </v-chip>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" @click="selectedCase = null" />
        </div>

        <v-row dense>
          <v-col cols="12" md="4">
            <div class="text-caption text-medium-emphasis mb-1">Contact</div>
            <div class="text-body-2">{{ selectedCase.patient.phone }}</div>
            <div class="text-body-2 mt-1">{{ selectedCase.patient.address }}</div>
            <div class="text-body-2 mt-1">PCP: {{ selectedCase.patient.primaryCareProvider }}</div>
            <div class="text-body-2">Insurance: {{ selectedCase.patient.insurance }}</div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption text-medium-emphasis mb-1">Comorbidities</div>
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
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption text-medium-emphasis mb-1">Care Goals</div>
            <div v-for="(goal, i) in selectedCase.case.careGoals" :key="i" class="d-flex align-center gap-1 mb-1">
              <v-icon
                :icon="i < selectedCase.case.goalsAchieved ? 'mdi-check-circle' : 'mdi-circle-outline'"
                :color="i < selectedCase.case.goalsAchieved ? 'success' : 'grey'"
                size="16"
              />
              <span class="text-body-2">{{ goal }}</span>
            </div>
          </v-col>
        </v-row>

        <div v-if="selectedCase.case.barriers.length > 0" class="mt-3">
          <div class="text-caption text-medium-emphasis mb-1">Barriers</div>
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

        <div class="mt-3">
          <div class="text-caption text-medium-emphasis mb-1">Latest Notes</div>
          <div class="text-body-2">{{ selectedCase.case.notes }}</div>
        </div>

        <div class="mt-3">
          <div class="text-caption text-medium-emphasis mb-2">Recent Activity</div>
          <div
            v-for="act in caseActivities(selectedCase.case.id)"
            :key="act.id"
            class="d-flex align-center gap-2 mb-2"
          >
            <v-icon :icon="activityIcon(act.type)" size="16" color="primary" />
            <span class="text-caption text-medium-emphasis">{{ formatDate(act.date) }}</span>
            <span class="text-body-2">{{ act.outcome }}</span>
          </div>
        </div>
      </v-sheet>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
}>()

const search = ref('')
const statusFilter = ref<string[]>([])
const riskFilter = ref<string[]>([])
const selectedCase = ref<CaseWithPatient | null>(null)

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
    if (search.value) {
      const s = search.value.toLowerCase()
      const name = `${item.patient.firstName} ${item.patient.lastName}`.toLowerCase()
      const dx = item.patient.primaryDiagnosis.toLowerCase()
      if (!name.includes(s) && !dx.includes(s)) return false
    }
    return true
  })
})

function caseActivities(caseId: string) {
  return props.activities
    .filter((a) => a.caseId === caseId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4)
}

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

function activityIcon(type: string) {
  const map: Record<string, string> = {
    'phone-call': 'mdi-phone-outline',
    'home-visit': 'mdi-home-account',
    'coordination': 'mdi-swap-horizontal',
    'documentation': 'mdi-file-document-outline',
  }
  return map[type] || 'mdi-circle-small'
}
</script>

<style scoped>
.overdue-row {
  background: rgba(var(--v-theme-error), 0.04);
}
.risk-table th {
  font-size: 0.75rem !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
