<script setup lang="ts">
import IconItem from "../IconItem.vue";
import { useTrackerItem } from "~/hooks/useTrackerItem.js";
import { useTrackerStateStore } from "~/stores/state-store.js";

const props = defineProps<{
  item: any;
}>();

const { position, max, alternateMax, id, sheet, labelPosition } =
  useTrackerItem(props.item);
const stateStore = useTrackerStateStore();
stateStore.init(id.value, {
  count: 0,
  mq: false,
});
const update = (value: number, mq: boolean) => {
  stateStore.update(id.value, {
    ...stateStore.get(id.value),
    count: value,
    mq: mq,
  });
};
const trackerStore = useTrackerStore();
const itemSheetDimensions = trackerStore.itemSheetDimensions(sheet.value.name);

const realMax = computed(() => {
  if (alternateMax.value === undefined || alternateMax.value === null)
    return max.value;
  return stateStore.get(id.value).mq ? alternateMax.value : max.value;
});

const updateStateInc = () => {
  update(
    (stateStore.get(id.value).count + 1) % (realMax.value + 1),
    stateStore.get(id.value).mq,
  );
};
const updateStateDec = () => {
  update(
    stateStore.get(id.value).count === 0
      ? realMax.value
      : (stateStore.get(id.value).count - 1) % (realMax.value + 1),
    stateStore.get(id.value).mq,
  );
};

const updateMqState = (mq: boolean) => {
  if (alternateMax.value === undefined || alternateMax.value === null) return;
  const nextRealMax = mq ? alternateMax.value : max.value;
  const newCount =
    stateStore.get(id.value).count > nextRealMax
      ? nextRealMax
      : stateStore.get(id.value).count;
  update(newCount, mq);
};

const handleWheel = (event: WheelEvent) => {
  if (event.deltaY < 0) {
    updateStateDec();
  } else {
    updateStateInc();
  }
};

const handleClickWheel = (event: MouseEvent) => {
  event.preventDefault();
  if (alternateMax.value === undefined || alternateMax.value === null) return;
  if (stateStore.get(id.value).mq) {
    updateMqState(false);
  } else {
    updateMqState(true);
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
    @mousedown.middle="handleClickWheel($event)"
  >
    <IconItem :item="item" :active="stateStore.get(id).count > 0" />
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
        v-if="stateStore.get(id).count > 0"
        :style="{
          fontFamily: 'countItemFont',
          color:
            stateStore.get(id).count === realMax
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
          hidden:
            stateStore.get(id).count === 0
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
        }"
        class="z-20 relative text-sm select-none text-shadow"
      >
        <span class="absolute -bottom-1.5 -left-1">
          {{ stateStore.get(id).count }}
        </span>
      </span>
    </div>
    <template v-else-if="labelPosition === 'right'">
      <div
        v-if="stateStore.get(id).count > 0"
        :style="{
          fontFamily: 'countItemFont',
          color:
            stateStore.get(id).count === realMax
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
          hidden:
            stateStore.get(id).count === 0
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
        }"
        class="z-20 absolute bottom-[-7px] left-[8px] align-middle inline-block text-center w-full text-sm select-none text-shadow"
      >
        {{ stateStore.get(id).count }}
      </div>
    </template>
    <template v-else>
      <div
        v-if="stateStore.get(id).count > 0"
        :style="{
          fontFamily: 'countItemFont',
          color:
            stateStore.get(id).count === realMax
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
          hidden:
            stateStore.get(id).count === 0
              ? 'var(--color-incrementalItemFont-max)'
              : 'var(--color-incrementalItemFont)',
        }"
        class="z-20 absolute bottom-[-3px] right-[-10px] align-middle inline-block text-center w-full text-lg select-none text-shadow"
      >
        {{ stateStore.get(id).count }}
      </div>
    </template>
    {{ alternateMax }}
    <div
      v-if="stateStore.get(id).mq"
      class="z-20 absolute top-[-5px] right-[0px] select-none text-shadow text-blue-500 text-xs"
      :style="{ fontFamily: 'labelItemFont' }"
    >
      MQ
    </div>
  </div>
</template>

<style scoped></style>
