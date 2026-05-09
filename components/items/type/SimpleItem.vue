<script setup lang="ts">
import IconItem from "../IconItem.vue";
import { useTrackerItem } from "~/hooks/useTrackerItem.js";
import { useTrackerStateStore } from "~/stores/state-store.js";

const props = defineProps<{
  item: any;
}>();

const { position, id, defaultActive } = useTrackerItem(props.item);
const stateStore = useTrackerStateStore();
stateStore.init(id.value, defaultActive.value === true);

const update = () => {
  stateStore.update(id.value, !stateStore.get(id.value));
};
</script>

<template>
  <div
    v-if="stateStore.get(id) !== undefined && stateStore.get(id) !== null"
    class="absolute z-10"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
    }"
    @click="update()"
    @contextmenu.prevent="update()"
  >
    <IconItem :item="item" :active="stateStore.get(id)" />
  </div>
</template>

<style scoped></style>
