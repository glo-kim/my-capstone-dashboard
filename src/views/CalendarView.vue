<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <div class="text-h5 font-weight-bold mb-1">Calendar</div>
        <div class="text-body-2 text-medium-emphasis">Manage your appointments and schedule</div>
      </div>
      <v-btn prepend-icon="mdi-plus" variant="flat" color="primary" size="small" style="padding: 8px 16px" @click="openNewAppointment">
        New Appointment
      </v-btn>
    </div>

    <!-- Toolbar -->
    <div class="d-flex align-center mb-4">
      <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="navigatePrev" />
      <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="navigateNext" />
      <v-btn variant="tonal" size="small" class="ml-2" @click="goToToday">Today</v-btn>
      <div class="text-body-1 font-weight-medium ml-4">{{ currentTitle }}</div>
      <v-spacer />
      <v-btn-toggle v-model="currentView" mandatory density="compact" variant="outlined" divided>
        <v-btn value="day" size="small">Day</v-btn>
        <v-btn value="week" size="small">Week</v-btn>
        <v-btn value="month" size="small">Month</v-btn>
      </v-btn-toggle>
    </div>

    <!-- Calendar Content -->
    <v-card variant="flat" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
      <!-- Day View -->
      <div v-if="currentView === 'day'" class="pa-4">
        <div v-if="isToday(currentDate)" class="d-flex align-center mb-3">
          <v-avatar color="primary" size="28" class="mr-2">
            <span class="text-caption font-weight-bold text-white">{{ new Date(currentDate + 'T12:00:00').getDate() }}</span>
          </v-avatar>
          <span class="text-body-2 font-weight-medium text-primary">Today</span>
        </div>
        <div class="day-schedule">
          <div v-for="hour in dayHours" :key="hour" class="hour-row d-flex">
            <div class="hour-label text-caption text-medium-emphasis" style="width: 60px; flex-shrink: 0;">
              {{ formatHour(hour) }}
            </div>
            <div class="hour-slot flex-grow-1 position-relative" style="min-height: 60px; border-top: 1px solid rgba(0,0,0,0.06);">
              <div
                v-for="apt in getAppointmentsForHour(currentDate, hour)"
                :key="apt.id"
                class="appointment-block pa-2 rounded-lg mb-1 cursor-pointer"
                :style="{ backgroundColor: getColor(apt.type) }"
                @click="viewAppointment(apt)"
              >
                <div class="text-caption font-weight-bold text-white">{{ apt.title }}</div>
                <div class="text-caption text-white" style="opacity: 0.8;">
                  {{ apt.startTime }} - {{ apt.endTime }} · {{ apt.location }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-if="currentView === 'week'" class="pa-4">
        <div class="week-grid">
          <!-- Header row -->
          <div class="week-header">
            <div class="time-gutter"></div>
            <div v-for="day in weekDays" :key="day.date" class="day-column-header text-center">
              <div class="text-caption" :class="isToday(day.date) ? 'text-primary font-weight-medium' : 'text-medium-emphasis'">{{ day.label }}</div>
              <div v-if="isToday(day.date)" class="d-flex justify-center">
                <v-avatar color="primary" size="30">
                  <span class="text-caption font-weight-bold text-white">{{ day.dayNum }}</span>
                </v-avatar>
              </div>
              <div v-else class="text-body-2 font-weight-medium">
                {{ day.dayNum }}
              </div>
            </div>
          </div>
          <!-- Time rows -->
          <div v-for="hour in dayHours" :key="hour" class="week-row">
            <div class="time-gutter text-caption text-medium-emphasis" style="padding-top: 2px;">
              {{ formatHour(hour) }}
            </div>
            <div v-for="day in weekDays" :key="day.date" class="day-cell" :class="{ 'day-cell-today': isToday(day.date) }">
              <div
                v-for="apt in getAppointmentsForHour(day.date, hour)"
                :key="apt.id"
                class="appointment-chip pa-1 px-2 rounded mb-1 cursor-pointer"
                :style="{ backgroundColor: getColor(apt.type) }"
                @click="viewAppointment(apt)"
              >
                <div class="text-caption text-white font-weight-medium" style="font-size: 0.65rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ apt.startTime }} {{ apt.patientName || apt.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Month View -->
      <div v-if="currentView === 'month'" class="pa-4">
        <div class="month-grid-layout">
          <!-- Day headers -->
          <div class="month-header">
            <div v-for="dayLabel in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="dayLabel" class="month-header-cell text-caption text-medium-emphasis">
              {{ dayLabel }}
            </div>
          </div>
          <!-- Weeks -->
          <div v-for="(week, wi) in monthWeeks" :key="wi" class="month-week-row">
            <div
              v-for="day in week"
              :key="day.date"
              class="month-day-cell"
              :class="{ 'month-day-today': isToday(day.date) }"
            >
              <div class="month-day-number text-caption" :class="[day.currentMonth ? '' : 'text-disabled', isToday(day.date) ? 'text-primary font-weight-bold' : '']">
                {{ day.dayNum }}
              </div>
              <div class="month-day-events">
                <div
                  v-for="apt in getAppointmentsForDate(day.date).slice(0, 3)"
                  :key="apt.id"
                  class="month-event rounded cursor-pointer"
                  :style="{ backgroundColor: getColor(apt.type) }"
                  @click="viewAppointment(apt)"
                >
                  <span class="month-event-text">{{ apt.startTime }} {{ apt.patientName || apt.title }}</span>
                </div>
                <div v-if="getAppointmentsForDate(day.date).length > 3" class="text-caption text-primary month-event-more">
                  +{{ getAppointmentsForDate(day.date).length - 3 }} more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- New Appointment Dialog -->
    <v-dialog v-model="showNewDialog" max-width="500">
      <v-card variant="flat" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
        <v-card-title class="pa-4 border-b font-weight-bold text-body-1">New Appointment</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="newAppointment.title"
            label="Title"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-select
            v-model="newAppointment.patientId"
            :items="patientOptions"
            item-title="name"
            item-value="id"
            label="Associate with Patient/Case"
            variant="outlined"
            density="comfortable"
            clearable
            class="mb-3"
          />
          <v-select
            v-model="newAppointment.type"
            :items="appointmentTypes"
            label="Appointment Type"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-row class="mb-3">
            <v-col cols="6">
              <v-text-field
                v-model="newAppointment.date"
                label="Date"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="newAppointment.startTime"
                label="Start"
                type="time"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="newAppointment.endTime"
                label="End"
                type="time"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="newAppointment.location"
            label="Location"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-textarea
            v-model="newAppointment.notes"
            label="Notes"
            variant="outlined"
            density="comfortable"
            rows="2"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="showNewDialog = false">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="createAppointment">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Appointment Dialog -->
    <v-dialog v-model="showViewDialog" max-width="400">
      <v-card variant="flat" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)" v-if="selectedAppointment">
        <v-card-title class="pa-4 border-b">
          <div class="text-body-1 font-weight-bold">{{ selectedAppointment.title }}</div>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-clock-outline" size="18" class="mr-2 text-medium-emphasis" />
            <span class="text-body-2">{{ selectedAppointment.date }} · {{ selectedAppointment.startTime }} - {{ selectedAppointment.endTime }}</span>
          </div>
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-map-marker-outline" size="18" class="mr-2 text-medium-emphasis" />
            <span class="text-body-2">{{ selectedAppointment.location }}</span>
          </div>
          <div v-if="selectedAppointment.patientName" class="d-flex align-center mb-3">
            <v-icon icon="mdi-account-outline" size="18" class="mr-2 text-medium-emphasis" />
            <span class="text-body-2">{{ selectedAppointment.patientName }} ({{ selectedAppointment.caseId }})</span>
          </div>
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-tag-outline" size="18" class="mr-2 text-medium-emphasis" />
            <v-chip size="x-small" :style="{ backgroundColor: getColor(selectedAppointment.type), color: 'white' }">{{ selectedAppointment.type }}</v-chip>
          </div>
          <div v-if="selectedAppointment.notes" class="mt-3">
            <div class="text-caption text-medium-emphasis mb-1">Notes</div>
            <div class="text-body-2">{{ selectedAppointment.notes }}</div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="showViewDialog = false">Close</v-btn>
          <v-btn variant="flat" color="primary" v-if="isEditable(selectedAppointment)" @click="openEditDialog">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Appointment Dialog -->
    <v-dialog v-model="showEditDialog" max-width="500">
      <v-card variant="flat" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
        <v-card-title class="pa-4 border-b font-weight-bold text-body-1">Edit Appointment</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="editAppointment.title"
            label="Title"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-select
            v-model="editAppointment.patientId"
            :items="patientOptions"
            item-title="name"
            item-value="id"
            label="Associate with Patient/Case"
            variant="outlined"
            density="comfortable"
            clearable
            class="mb-3"
          />
          <v-select
            v-model="editAppointment.type"
            :items="appointmentTypes"
            label="Appointment Type"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-row class="mb-3">
            <v-col cols="6">
              <v-text-field
                v-model="editAppointment.date"
                label="Date"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="editAppointment.startTime"
                label="Start"
                type="time"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="3">
              <v-text-field
                v-model="editAppointment.endTime"
                label="End"
                type="time"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="editAppointment.location"
            label="Location"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-textarea
            v-model="editAppointment.notes"
            label="Notes"
            variant="outlined"
            density="comfortable"
            rows="2"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="showEditDialog = false">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="saveEditedAppointment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import calendarData from '../data/calendar.json'
import metricsData from '../data/metrics.json'

interface Appointment {
  id: string
  title: string
  patientId: string | null
  patientName: string | null
  caseId: string | null
  type: string
  date: string
  startTime: string
  endTime: string
  location: string
  notes: string
  color: string
}

const currentView = ref(calendarData.preferences.defaultView)
const currentDate = ref(new Date().toISOString().split('T')[0])
const showNewDialog = ref(false)
const showViewDialog = ref(false)
const showEditDialog = ref(false)
const selectedAppointment = ref<Appointment | null>(null)
const appointments = ref<Appointment[]>(calendarData.appointments)

const editAppointment = ref({
  title: '',
  patientId: null as string | null,
  type: 'follow-up',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  notes: ''
})

const dayHours = Array.from({ length: 12 }, (_, i) => i + 7) // 7am - 6pm

const appointmentTypes = [
  'follow-up',
  'care-plan-review',
  'discharge-planning',
  'home-visit',
  'administrative',
  'internal'
]

const patientOptions = metricsData.patients.map(p => ({
  id: p.id,
  name: `${p.firstName} ${p.lastName}`
}))

const newAppointment = ref({
  title: '',
  patientId: null as string | null,
  type: 'follow-up',
  date: currentDate.value,
  startTime: '09:00',
  endTime: '09:30',
  location: '',
  notes: ''
})

const currentTitle = computed(() => {
  const d = new Date(currentDate.value + 'T12:00:00')
  if (currentView.value === 'day') {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  } else if (currentView.value === 'week') {
    const start = getWeekStart(d)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  } else {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
})

const weekDays = computed(() => {
  const d = new Date(currentDate.value + 'T12:00:00')
  const start = getWeekStart(d)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start)
    day.setDate(day.getDate() + i)
    return {
      date: day.toISOString().split('T')[0],
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: day.getDate()
    }
  })
})

const monthWeeks = computed(() => {
  const d = new Date(currentDate.value + 'T12:00:00')
  const year = d.getFullYear()
  const month = d.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const weeks: Array<Array<{ date: string; dayNum: number; currentMonth: boolean }>> = []
  const current = new Date(startDate)

  while (current <= lastDay || weeks.length < 5) {
    const week: Array<{ date: string; dayNum: number; currentMonth: boolean }> = []
    for (let i = 0; i < 7; i++) {
      week.push({
        date: current.toISOString().split('T')[0],
        dayNum: current.getDate(),
        currentMonth: current.getMonth() === month
      })
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
    if (weeks.length >= 6) break
  }
  return weeks
})

function getWeekStart(d: Date): Date {
  const start = new Date(d)
  start.setDate(start.getDate() - start.getDay())
  return start
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0]
}

function formatHour(hour: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h = hour > 12 ? hour - 12 : hour
  return `${h} ${ampm}`
}

function getColor(type: string): string {
  const typeColors: Record<string, string> = {
    'follow-up': 'rgb(var(--v-theme-primary))',
    'care-plan-review': '#009688',
    'discharge-planning': '#673AB7',
    'home-visit': '#F57C00',
    'administrative': '#FFA000',
    'internal': '#607D8B'
  }
  return typeColors[type] || 'rgb(var(--v-theme-primary))'
}

function getAppointmentsForDate(dateStr: string): Appointment[] {
  return appointments.value.filter(a => a.date === dateStr)
}

function getAppointmentsForHour(dateStr: string, hour: number): Appointment[] {
  return appointments.value.filter(a => {
    if (a.date !== dateStr) return false
    const startHour = parseInt(a.startTime.split(':')[0])
    return startHour === hour
  })
}

function navigatePrev() {
  const d = new Date(currentDate.value + 'T12:00:00')
  if (currentView.value === 'day') d.setDate(d.getDate() - 1)
  else if (currentView.value === 'week') d.setDate(d.getDate() - 7)
  else d.setMonth(d.getMonth() - 1)
  currentDate.value = d.toISOString().split('T')[0]
}

function navigateNext() {
  const d = new Date(currentDate.value + 'T12:00:00')
  if (currentView.value === 'day') d.setDate(d.getDate() + 1)
  else if (currentView.value === 'week') d.setDate(d.getDate() + 7)
  else d.setMonth(d.getMonth() + 1)
  currentDate.value = d.toISOString().split('T')[0]
}

function goToToday() {
  currentDate.value = new Date().toISOString().split('T')[0]
}

function openNewAppointment() {
  newAppointment.value = {
    title: '',
    patientId: null,
    type: 'follow-up',
    date: currentDate.value,
    startTime: '09:00',
    endTime: '09:30',
    location: '',
    notes: ''
  }
  showNewDialog.value = true
}

function createAppointment() {
  const patient = patientOptions.find(p => p.id === newAppointment.value.patientId)
  const apt: Appointment = {
    id: `APT-${Date.now()}`,
    title: newAppointment.value.title,
    patientId: newAppointment.value.patientId,
    patientName: patient?.name || null,
    caseId: newAppointment.value.patientId ? `CASE-${newAppointment.value.patientId.replace('PT-', '')}` : null,
    type: newAppointment.value.type,
    date: newAppointment.value.date,
    startTime: newAppointment.value.startTime,
    endTime: newAppointment.value.endTime,
    location: newAppointment.value.location,
    notes: newAppointment.value.notes,
    color: 'primary'
  }
  appointments.value.push(apt)
  showNewDialog.value = false
}

function viewAppointment(apt: Appointment) {
  selectedAppointment.value = apt
  showViewDialog.value = true
}

function isEditable(apt: Appointment): boolean {
  const today = new Date().toISOString().split('T')[0]
  return apt.date >= today
}

function openEditDialog() {
  if (!selectedAppointment.value) return
  const apt = selectedAppointment.value
  editAppointment.value = {
    title: apt.title,
    patientId: apt.patientId,
    type: apt.type,
    date: apt.date,
    startTime: apt.startTime,
    endTime: apt.endTime,
    location: apt.location,
    notes: apt.notes
  }
  showViewDialog.value = false
  showEditDialog.value = true
}

function saveEditedAppointment() {
  if (!selectedAppointment.value) return
  const idx = appointments.value.findIndex(a => a.id === selectedAppointment.value!.id)
  if (idx === -1) return

  const patient = patientOptions.find(p => p.id === editAppointment.value.patientId)
  appointments.value[idx] = {
    ...appointments.value[idx],
    title: editAppointment.value.title,
    patientId: editAppointment.value.patientId,
    patientName: patient?.name || null,
    caseId: editAppointment.value.patientId ? `CASE-${editAppointment.value.patientId.replace('PT-', '')}` : null,
    type: editAppointment.value.type,
    date: editAppointment.value.date,
    startTime: editAppointment.value.startTime,
    endTime: editAppointment.value.endTime,
    location: editAppointment.value.location,
    notes: editAppointment.value.notes
  }
  showEditDialog.value = false
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.cursor-pointer {
  cursor: pointer;
}

.appointment-block:hover,
.appointment-chip:hover,
.month-event:hover {
  opacity: 0.85;
}

.hour-row {
  min-height: 60px;
}

/* Week view grid layout */
.week-header,
.week-row {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
}

.week-row {
  min-height: 56px;
}

.time-gutter {
  flex-shrink: 0;
}

.day-column-header {
  padding: 4px 0;
}

.day-cell {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  padding: 2px 4px;
  min-height: 56px;
}

.day-cell-today {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

/* Month view grid layout */
.month-grid-layout {
  display: flex;
  flex-direction: column;
}

.month-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 8px;
}

.month-header-cell {
  text-align: center;
  padding: 4px;
  font-weight: 500;
}

.month-week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.month-day-cell {
  min-height: 100px;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 6px;
  display: flex;
  flex-direction: column;
}

.month-day-cell:nth-child(7) {
  border-right: none;
}

.month-day-today {
  background-color: rgba(var(--v-theme-primary), 0.06);
}

.month-day-number {
  margin-bottom: 4px;
}

.month-day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.month-event {
  padding: 2px 6px;
  overflow: hidden;
}

.month-event-text {
  font-size: 0.675rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  line-height: 1.4;
}

.month-event-more {
  font-size: 0.675rem;
  padding: 1px 4px;
}
</style>
