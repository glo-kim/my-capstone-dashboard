<template>
  <v-app>
    <v-app-bar flat color="white" class="app-bar-md3" border="b">
      <template #prepend>
        <div class="d-flex align-center ml-6">
          <v-avatar color="primary" size="34" rounded="lg" class="mr-3">
            <v-icon icon="mdi-heart-pulse" size="20" color="on-primary" />
          </v-avatar>
          <div>
            <div class="text-body-2 font-weight-bold" style="letter-spacing: -0.01em; line-height: 1.2">
              Evergreen Health
            </div>
            <div class="text-caption text-medium-emphasis" style="font-size: 0.7rem">
              Care Coordination Platform
            </div>
          </div>
        </div>
      </template>
      <template #append>
        <v-btn icon="mdi-magnify" variant="text" size="small" class="mr-1" />
        <v-btn icon="mdi-bell-outline" variant="text" size="small" class="mr-1" />
        <v-divider vertical class="mx-2" length="24" />
        <v-avatar color="primary-container" size="34" class="mr-6" rounded="lg">
          <span class="text-caption font-weight-bold" style="color: rgb(var(--v-theme-on-primary-container))">GK</span>
        </v-avatar>
      </template>
    </v-app-bar>

    <v-main class="bg-background">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-bar-md3 {
  backdrop-filter: blur(8px);
}
</style>
