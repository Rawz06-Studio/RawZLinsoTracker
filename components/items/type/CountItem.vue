<script setup lang="ts">
import IconItem from "../IconItem.vue";
import { useTrackerItem } from "~/hooks/useTrackerItem.js";
import { useTrackerStateStore } from "~/stores/state-store.js";

const props = defineProps<{
  item: any;
}>();

const { position, count, id, defaultActive, sheet } = useTrackerItem(
  props.item,
);
const stateStore = useTrackerStateStore();
stateStore.init(id.value, count.value.start);
const update = (value) => {
  stateStore.update(id.value, value);
};

const trackerStore = useTrackerStore();
const itemSheetDimensions = trackerStore.itemSheetDimensions(sheet.value.name);

const updateStateInc = () => {
  update((stateStore.get(id.value) + count.value.step) % (count.value.max + 1));
};
const updateStateDec = () => {
  update(
    stateStore.get(id.value) === 0
      ? count.value.max
      : (stateStore.get(id.value) - 1) % (count.value.max + 1),
  );
};
const handleWheel = (event) => {
  if (event.deltaY < 0) {
    updateStateDec();
  } else {
    updateStateInc();
  }
};
</script>

<template>
  <div
    v-if="stateStore.get(id) !== undefined && stateStore.get(id) !== null"
    class="absolute z-10 flex items-center justify-between"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      width: `${2 * itemSheetDimensions.width}px`,
      height: `${itemSheetDimensions.height}px`,
    }"
    @click="updateStateInc()"
    @contextmenu.prevent="updateStateDec()"
    @wheel.prevent="handleWheel($event)"
  >
    <div
      class="relative"
      :style="{
        width: `${2 * itemSheetDimensions.width}px`,
        height: `${itemSheetDimensions.height}px`,
      }"
    >
      <IconItem :item="item" :active="defaultActive" />
    </div>
    <div
      :style="{
        fontFamily: 'countItemFont',
        color:
          stateStore.get(id) === count.max
            ? 'var(--color-countItemFont-max)'
            : 'var(--color-countItemFont)',
      }"
      class="z-20 h-full flex justify-center items-center text-center w-full text-lg select-none text-shadow"
    >
      {{ stateStore.get(id) }}
    </div>
  </div>
</template>

<style scoped></style>
