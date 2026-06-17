<template>
  <v-card
    :color="cardColor"
    variant="tonal"
    class="kpi-card pa-4"
  >
    <div class="d-flex align-center justify-space-between mb-2">
      <v-icon :icon="icon" size="24" :color="iconColor" />
      <v-chip
        v-if="trend !== undefined"
        :color="trendColor"
        size="x-small"
        variant="flat"
        class="font-weight-medium"
      >
        <v-icon
          :icon="trend >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
          size="12"
          start
        />
        {{ Math.abs(trend) }}%
      </v-chip>
    </div>
    <div class="text-h4 font-weight-bold mb-1">{{ displayValue }}</div>
    <div class="text-body-2 text-medium-emphasis">{{ label }}</div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number | string
  label: string
  icon: string
  color?: string
  trend?: number
  trendDirection?: 'up-good' | 'up-bad'
  isPercent?: boolean
}>()

const displayValue = computed(() => {
  if (props.isPercent && typeof props.value === 'number') {
    return `${Math.round(props.value * 100)}%`
  }
  return props.value
})

const cardColor = computed(() => props.color ?? 'primary')
const iconColor = computed(() => props.color ?? 'primary')

const trendColor = computed(() => {
  if (props.trend === undefined) return 'grey'
  const isPositive = props.trend >= 0
  const upIsGood = props.trendDirection !== 'up-bad'
  return (isPositive === upIsGood) ? 'success' : 'error'
})
</script>

<style scoped>
.kpi-card {
  min-height: 120px;
}
</style>
