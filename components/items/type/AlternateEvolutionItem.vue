<script setup lang="ts">
import { computed } from "vue";
import IconItem from "../IconItem.vue";
import { useTrackerItem } from "~/hooks/useTrackerItem.js";
import { useTrackerStateStore } from "~/stores/state-store.js";

const props = defineProps<{
  item: any;
}>();

const { position, defaultActive, id, next, globalLabel, sizeLabel } =
  useTrackerItem(props.item);
const max = computed(() => {
  return (next?.value?.length ?? 0) + 1;
});
const stateStore = useTrackerStateStore();
stateStore.init(id.value, {
  state: 0,
  active: defaultActive.value,
});
const currentState = computed(() => stateStore.get(id.value));
const changeActive = () => {
  const state = currentState.value;
  if (!state) return;
  stateStore.update(id.value, {
    ...state,
    active: !state.active,
  });
};
const updateStateInc = () => {
  const state = currentState.value;
  if (!state || max.value <= 0) return;
  stateStore.update(id.value, {
    ...state,
    state: (state.state + 1) % max.value,
  });
};

const currentItem = computed(() => {
  const state = currentState.value;
  if (!state || state.state < 1) {
    return props.item;
  } else {
    return next.value[state.state - 1] ?? props.item;
  }
});
</script>

<template>
  <div
    v-if="currentState"
    class="absolute z-10"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
    }"
    @click="changeActive()"
    @contextmenu.prevent="updateStateInc()"
  >
    <IconItem
      :item="currentItem"
      :active="currentState.active"
      :is-max-label="currentState.state === max - 1"
    />
    <div
      :style="{
        fontFamily: 'labelItemFont',
        color: 'var(--color-labelItemFont)',
        fontSize: sizeLabel + 'px',
      }"
      class="z-20 absolute top-[30px] w-full text-center text-sm select-none text-shadow"
    >
      {{ globalLabel }}
    </div>
  </div>
</template>

<style scoped></style>
