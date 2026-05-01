<script setup>
import {computed} from "vue";
import IconItem from "../IconItem.vue";
import {useTrackerItem} from "~/hooks/useTrackerItem.js";
import {useTrackerStateStore} from "~/stores/state-store.js";

const props = defineProps(['item'])

const {position, defaultActive, id, increments} = useTrackerItem(props.item)
const max = computed(() => {
  return increments.value.length + 2
})
const stateStore = useTrackerStateStore()
stateStore.init(id.value, defaultActive.value === true ? 1 : 0)

const update = (value) => {
  stateStore.update(id.value, value);
}
</script>

<template>
  <div
      v-if="stateStore.get(id) !== undefined && stateStore.get(id) !== null"
      class="absolute z-10"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
      }"
      @click="update((stateStore.get(id) + 1)%max)"
      @contextmenu.prevent="update(stateStore.get(id) === 0 ? max - 1 : (stateStore.get(id) - 1)%max)"
  >
    <IconItem
        :item="item"
        :active="stateStore.get(id) > 0"
    />
    <div
        class="z-20 absolute top-[20px] select-none text-sm text-shadow"
        :class="{'hidden': stateStore.get(id)  < 2}"
        :style="{fontFamily: 'incrementalItemFont', color: stateStore.get(id)  === max-1 ? 'var(--color-incrementalItemFont-max)' : 'var(--color-incrementalItemFont)'}"
    >
      {{increments[stateStore.get(id) -2]}}
    </div>
  </div>
</template>

<style scoped>

</style>