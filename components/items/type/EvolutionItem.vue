<script setup lang="ts">
import { computed } from "vue";
import IconItem from "../IconItem.vue";
import { useTrackerItem } from "~/hooks/useTrackerItem.js";
import { useTrackerStateStore } from "~/stores/state-store.js";

const props = defineProps<{
  item: any;
}>();

const { position, defaultActive, id, next } = useTrackerItem(props.item);
const max = computed(() => {
  return (next?.value?.length ?? 0) + 2;
});
const stateStore = useTrackerStateStore();
stateStore.init(id.value, defaultActive.value === true ? 1 : 0);
const update = (value) => {
  stateStore.update(id.value, value);
};
const currentItem = computed(() => {
  if (stateStore.get(id.value) < 2) {
    return props.item;
  } else {
    return next.value[stateStore.get(id.value) - 2];
  }
});
</script>

<template>
  <div
    v-if="stateStore.get(id) !== undefined && stateStore.get(id) !== null"
    class="absolute z-10"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
    }"
    @click="update((stateStore.get(id) + 1) % max)"
    @contextmenu.prevent="
      update(
        stateStore.get(id) === 0 ? max - 1 : (stateStore.get(id) - 1) % max,
      )
    "
  >
    <IconItem
      :item="currentItem"
      :active="stateStore.get(id) > 0"
      :is-max-label="stateStore.get(id) === max - 1"
    />
  </div>
</template>

<style scoped></style>
