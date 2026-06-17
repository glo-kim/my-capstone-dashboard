<template>
  <v-card variant="flat" class="pa-5" style="background: rgb(var(--v-theme-surface-light)); border: 1px solid rgba(var(--v-theme-outline-variant), 0.5)">
    <div class="section-title mb-4">Weekly Trends</div>
    <Line :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
  trend: {
    labels: string[]
    activeCases: number[]
    highRiskCount: number[]
    contactsMade: number[]
    goalsAchieved: number[]
  }
}>()

const chartData = computed(() => ({
  labels: props.trend.labels,
  datasets: [
    {
      label: 'Active Cases',
      data: props.trend.activeCases,
      borderColor: '#1B6B5A',
      backgroundColor: 'rgba(27, 107, 90, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
    {
      label: 'High Risk',
      data: props.trend.highRiskCount,
      borderColor: '#BA1A1A',
      backgroundColor: 'rgba(186, 26, 26, 0.08)',
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
    {
      label: 'Contacts Made',
      data: props.trend.contactsMade,
      borderColor: '#4B635B',
      backgroundColor: 'rgba(75, 99, 91, 0.08)',
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
    {
      label: 'Goals Achieved',
      data: props.trend.goalsAchieved,
      borderColor: '#006D3A',
      backgroundColor: 'rgba(0, 109, 58, 0.08)',
      fill: false,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.5,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: { size: 11, family: 'Inter, system-ui, sans-serif', weight: '500' as const },
      },
    },
    tooltip: {
      backgroundColor: '#1C1B1F',
      titleFont: { family: 'Inter, system-ui, sans-serif', weight: '600' as const, size: 12 },
      bodyFont: { family: 'Inter, system-ui, sans-serif', size: 11 },
      cornerRadius: 12,
      padding: 12,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11, family: 'Inter, system-ui, sans-serif' } },
      border: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
      ticks: { font: { size: 11, family: 'Inter, system-ui, sans-serif' } },
      border: { display: false },
    },
  },
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
