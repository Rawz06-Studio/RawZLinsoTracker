<script setup>
import {ref} from "vue";
import IconItem from "../IconItem.vue";
import {useTrackerItem} from "~/hooks/useTrackerItem.js";
import {useTrackerStateStore} from "~/stores/state-store.js";

const props = defineProps(['item'])

const {position, defaultActive, id, glow, sheet} = useTrackerItem(props.item)
const trackerStore = useTrackerStore();
const stateStore = useTrackerStateStore()
stateStore.init(id.value, defaultActive.value === true)

const update = () => {
  stateStore.update(id.value, !stateStore.get(id.value));
}
const glowImage = glow.value(trackerStore.trackerName)
const itemSheetDimensions = trackerStore.itemSheetDimensions(sheet.value.name)
</script>

<template>
  <div
      v-if="stateStore.get(id) !== undefined && stateStore.get(id) !== null"
      class="absolute z-30"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
      }"
      @click="update()"
      @contextmenu.prevent="update()"
  >
    <IconItem
        v-if="stateStore.get(id)"
        :item="item"
        :active="stateStore.get(id)"
    />
    <div
v-else :style="{
      width: itemSheetDimensions.width + 'px',
      height: itemSheetDimensions.height + 'px',
    }"/>
  </div>
  <div
class="absolute z-20 select-none pointer-events-none -translate-x-1/2 -translate-y-1/2 duration-1000	" :style="{
        left: position.x + 18 + 'px',
        top: position.y + 18 + 'px',
      }" :class="{hidden: !stateStore.get(id)}">
    <img class="animate-low-spin" :src="glowImage" alt="glow" >
  </div>
</template>

<style scoped>
.animate-low-spin {
  animation: spin 8s linear infinite;
}
</style>