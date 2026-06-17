<template>
  <v-app>
    <v-app-bar elevation="0" color="surface" border="b">
      <template #prepend>
        <v-icon icon="mdi-heart-pulse" color="primary" class="ml-2" />
      </template>
      <v-app-bar-title class="font-weight-bold text-body-1">
        Evergreen Health · Care Coordination
      </v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-bell-outline" variant="text" size="small" />
        <v-avatar color="primary" size="32" class="mr-2">
          <span class="text-caption font-weight-bold text-white">GK</span>
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
