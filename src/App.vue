<template>
  <v-app>
    <v-navigation-drawer rail permanent color="white" border="r" :rail-width="74">
      <div class="d-flex flex-column align-center py-4">
        <v-avatar color="primary" size="34" rounded="lg">
          <v-icon icon="mdi-heart-pulse" size="20" color="on-primary" />
        </v-avatar>
      </div>

      <v-divider class="mx-2 mb-2" />

      <div class="nav-rail-items">
        <router-link to="/" class="nav-rail-btn" active-class="nav-rail-btn--active" exact>
          <v-icon :icon="route.path === '/' ? 'mdi-view-dashboard' : 'mdi-view-dashboard-outline'" size="22" />
          <span class="nav-rail-label" :class="{ 'nav-rail-label--active': route.path === '/' }">Home</span>
        </router-link>
        <div class="nav-rail-btn">
          <v-icon icon="mdi-folder-account-outline" size="22" />
          <span class="nav-rail-label">My Cases</span>
        </div>
        <div class="nav-rail-btn">
          <v-icon icon="mdi-checkbox-marked-outline" size="22" />
          <span class="nav-rail-label">My Tasks</span>
        </div>
        <div class="nav-rail-btn">
          <v-icon icon="mdi-calendar-clock-outline" size="22" />
          <span class="nav-rail-label">Calendar</span>
        </div>
        <div class="nav-rail-btn">
          <v-icon icon="mdi-chart-bar" size="22" />
          <span class="nav-rail-label">Reports</span>
        </div>
        <div class="nav-rail-btn">
          <v-icon icon="mdi-toolbox-outline" size="22" />
          <span class="nav-rail-label">Tools</span>
        </div>
      </div>

      <template #append>
        <div class="d-flex flex-column align-center pb-4" style="gap: 12px;">
          <div class="nav-rail-btn">
            <v-icon icon="mdi-bell-outline" size="22" />
            <span class="nav-rail-label">Alerts</span>
          </div>
          <div class="nav-rail-btn">
            <v-icon icon="mdi-magnify" size="22" />
            <span class="nav-rail-label">Search</span>
          </div>
          <v-avatar color="primary-container" size="34" rounded="lg">
            <span class="text-caption font-weight-bold" style="color: rgb(var(--v-theme-on-primary-container))">GK</span>
          </v-avatar>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-background">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.nav-rail-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
}

.nav-rail-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  padding: 12px 0 8px;
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.15s;
}

.nav-rail-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-rail-btn--active {
  color: rgb(var(--v-theme-primary));
}

.nav-rail-label {
  font-size: 0.625rem;
  margin-top: 4px;
  line-height: 1;
  font-weight: 500;
}

.nav-rail-label--active {
  font-weight: 900;
}
</style>
