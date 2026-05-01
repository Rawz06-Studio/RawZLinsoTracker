<script setup>
import Item from "./Item.vue";
import { useCustomFont } from "~/hooks/useCustomFont.js";
import useOpenSmallWindow from "~/hooks/useOpenSmallWindow.js";

const trackerStore = useTrackerStore();
const fonts = trackerStore.fonts();
const tracker = trackerStore.trackerName;
const items = trackerStore.items();
const dim = trackerStore.dimensions();
for (const font of fonts) {
  useCustomFont(tracker, font.name, font.filename);
  document.documentElement.style.setProperty(
    "--color-" + font.name,
    font.colors[0],
  );
  document.documentElement.style.setProperty(
    "--color-" + font.name + "-max",
    font.colors[1],
  );
}

useOpenSmallWindow(dim.width, dim.height);
</script>

<template>
  <div v-for="item of items" :key="item.Name" class="relative">
    <Item :item="item" />
  </div>
</template>

<style scoped></style>
