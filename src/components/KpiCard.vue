<template>
  <v-card
    variant="flat"
    class="kpi-card pa-4"
    :style="cardStyle"
  >
    <div class="d-flex align-center justify-space-between mb-3">
      <v-avatar :color="iconBgColor" size="40" rounded="lg" variant="flat">
        <v-icon :icon="icon" size="20" :color="iconFgColor" />
      </v-avatar>
      <v-chip
        v-if="trend !== undefined"
        :color="trendColor"
        size="x-small"
        variant="tonal"
        class="font-weight-medium"
      >
        <v-icon
          :icon="trend >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
          size="14"
          start
        />
        {{ Math.abs(trend) }}%
      </v-chip>
    </div>
    <div class="text-h4 font-weight-bold kpi-value">{{ displayValue }}</div>
    <div class="text-body-2 text-medium-emphasis mt-1" style="letter-spacing: 0.01em">{{ label }}</div>
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

const cardStyle = computed(() => ({
  background: `rgba(var(--v-theme-${props.color ?? 'primary'}), 0.06)`,
  border: `1px solid rgba(var(--v-theme-${props.color ?? 'primary'}), 0.12)`,
}))

const iconBgColor = computed(() => `${props.color ?? 'primary'}`)
const iconFgColor = computed(() => `on-${props.color ?? 'primary'}`)

const trendColor = computed(() => {
  if (props.trend === undefined) return 'grey'
  const isPositive = props.trend >= 0
  const upIsGood = props.trendDirection !== 'up-bad'
  return (isPositive === upIsGood) ? 'success' : 'error'
})
</script>

<style scoped>
.kpi-card {
  min-height: 130px;
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1),
              box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.06),
              0px 1px 2px rgba(0, 0, 0, 0.08);
}
.kpi-value {
  letter-spacing: -0.02em;
  line-height: 1.1;
}
</style>
