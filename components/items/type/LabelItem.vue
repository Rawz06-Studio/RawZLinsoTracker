<script setup>
import {computed} from "vue";
import IconItem from "../IconItem.vue";
import {useTrackerItem} from "~/hooks/useTrackerItem.js";
import {useTrackerStateStore} from "~/stores/state-store.js";

const props = defineProps(['item'])

const {position, sheet, defaultActive, id, labels, defaultLabel, sizeLabel, hasDefaultLabel} = useTrackerItem(props.item)
const trackerStore = useTrackerStore();
const itemSheetDimensions = trackerStore.itemSheetDimensions(sheet.value.name)
const stateStore = useTrackerStateStore()
stateStore.init(id.value, {
  state: defaultLabel.value ?? 0,
  active: defaultActive.value
})

const updateStateInc = () => {
  if(hasDefaultLabel.value) {
    if(stateStore.get(id.value)?.state+1 < labels.value.length) {
      stateStore.update(id.value, {...stateStore.get(id.value), state: stateStore.get(id.value).state+1});
    }
  } else {
    stateStore.update(id.value, {...stateStore.get(id.value), state: (stateStore.get(id.value).state+1)%labels.value.length});
  }
}
const updateStateDec = () => {
  if(hasDefaultLabel.value) {
    if(stateStore.get(id.value).state-1 >= 0) {
      stateStore.update(id.value, {...stateStore.get(id.value), state: stateStore.get(id.value).state-1});
    }
  } else {
    stateStore.update(id.value, {...stateStore.get(id.value), state: (stateStore.get(id.value).state-1 < 0 ? labels.value.length-1 : stateStore.get(id.value).state-1)});
  }
}
const updateActive = () => {
  stateStore.update(id.value, {...stateStore.get(id.value), active: !stateStore.get(id.value).active});
}
const currentLabel = computed(() => {
  return labels.value[stateStore.get(id.value).state]
})
const handleWheel = (event) => {
  if (event.deltaY < 0) {
    updateStateDec()
  } else {
    updateStateInc()
  }
}
const handleRightClick = () => {
  if(!hasDefaultLabel.value) {
    updateStateInc()
  }
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
      @click="updateActive()"
      @contextmenu.prevent="handleRightClick()"
      @wheel.prevent="handleWheel($event)"
  >
    <IconItem
        :item="item"
        :active="stateStore.get(id).active"
    />
    <div :style="{fontFamily: 'labelItemFont', color: 'var(--color-labelItemFont)', fontSize: sizeLabel + 'px', top: itemSheetDimensions.height - item.OffsetLabel + 'px'}" class="z-20 absolute w-full text-center text-xs select-none text-shadow">
      {{currentLabel}}
    </div>
  </div>
</template>

<style scoped>

</style>