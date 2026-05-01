<script setup lang="ts">
import Tracker from "~/components/Tracker.vue";
const route = useRoute()
const tracker = route.params.tracker
const id = route.params.id
const isSmallWindow = route.query.isSmallWindow

useHead({
  title: `Tracker ${tracker} - ${id}`,
})

</script>

<template>
  <Tracker :id="id" :tracker="tracker" :is-small-window="isSmallWindow"/>
</template>

<style scoped>

</style>