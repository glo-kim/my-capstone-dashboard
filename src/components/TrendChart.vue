<template>
  <v-card class="pa-4">
    <div class="text-subtitle-1 font-weight-bold mb-3">Weekly Trends</div>
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
      borderColor: '#6750A4',
      backgroundColor: 'rgba(103, 80, 164, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: 'High Risk',
      data: props.trend.highRiskCount,
      borderColor: '#B3261E',
      backgroundColor: 'rgba(179, 38, 30, 0.1)',
      fill: false,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: 'Contacts Made',
      data: props.trend.contactsMade,
      borderColor: '#625B71',
      backgroundColor: 'rgba(98, 91, 113, 0.1)',
      fill: false,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: 'Goals Achieved',
      data: props.trend.goalsAchieved,
      borderColor: '#386A20',
      backgroundColor: 'rgba(56, 106, 32, 0.1)',
      fill: false,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
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
        padding: 16,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(28, 27, 31, 0.9)',
      cornerRadius: 12,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0,0,0,0.06)' },
      ticks: { font: { size: 11 } },
    },
  },
}
</script>
