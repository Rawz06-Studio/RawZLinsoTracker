<script setup lang="ts">
import AppTracker from "~/components/AppTracker.vue";
const route = useRoute();
const tracker = route.params.tracker;
const id = route.params.id;
const isSmallWindow = route.query.isSmallWindow;

useHead({
  title: `Tracker ${tracker} - ${id}`,
});
</script>

<template>
  <AppTracker :id="id" :tracker="tracker" :is-small-window="isSmallWindow" />
</template>

<style scoped></style>
