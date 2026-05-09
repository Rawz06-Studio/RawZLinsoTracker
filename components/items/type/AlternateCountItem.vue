<script setup lang="ts">
import IconItem from "../IconItem.vue";
import { useTrackerItem } from "~/hooks/useTrackerItem.js";
import { useTrackerStateStore } from "~/stores/state-store.js";

const props = defineProps<{
  item: any;
}>();

const { position, max, id, sheet, labelPosition } = useTrackerItem(props.item);
const stateStore = useTrackerStateStore();
stateStore.init(id.value, 0);
const update = (value) => {
  stateStore.update(id.value, value);
};
const trackerStore = useTrackerStore();
const itemSheetDimensions = trackerStore.itemSheetDimensions(sheet.value.name);

const updateStateInc = () => {
  update((stateStore.get(id.value) + 1) % (max.value + 1));
};
const updateStateDec = () => {
  update(
    stateStore.get(id.value) === 0
      ? max.value
      : (stateStore.get(id.value) - 1) % (max.value + 1),
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
    class="absolute z-10"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
    }"
    @click="updateStateInc()"
    @contextmenu.prevent="updateStateDec()"
    @wheel.prevent="handleWheel($event)"
  >
    <IconItem :item="item" :active="stateStore.get(id) > 0" />
    <div
      v-if="labelPosition === 'left'"
      class="absolute flex items-end"
      :style="{
        width: itemSheetDimensions.width,
        height: itemSheetDimensions.height,
        inset: 0,
      }"
    >
      <span
        v-if="stateStore.get(id) > 0"
        :style="{
          fontFamily: 'countItemFont',
          color:
            stateStore.get(id) === max
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
          hidden:
            stateStore.get(id) === 0
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
        }"
        class="z-20 relative text-sm select-none text-shadow"
      >
        <span class="absolute -bottom-1.5 -left-1">
          {{ stateStore.get(id) }}
        </span>
      </span>
    </div>
    <template v-else-if="labelPosition === 'right'">
      <div
        v-if="stateStore.get(id) > 0"
        :style="{
          fontFamily: 'countItemFont',
          color:
            stateStore.get(id) === max
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
          hidden:
            stateStore.get(id) === 0
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
        }"
        class="z-20 absolute bottom-[-7px] left-[8px] align-middle inline-block text-center w-full text-sm select-none text-shadow"
      >
        {{ stateStore.get(id) }}
      </div>
    </template>
    <template v-else>
      <div
        v-if="stateStore.get(id) > 0"
        :style="{
          fontFamily: 'countItemFont',
          color:
            stateStore.get(id) === max
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
          hidden:
            stateStore.get(id) === 0
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
        }"
        class="z-20 absolute bottom-[-3px] right-[-10px] align-middle inline-block text-center w-full text-lg select-none text-shadow"
      >
        {{ stateStore.get(id) }}
      </div>
    </template>
  </div>
</template>

<style scoped></style>
