<script setup lang="ts">
import IconItem from "../IconItem.vue";
import ImageCrop from "../../utils/ImageCrop.vue";
import { useTrackerItem } from "~/hooks/useTrackerItem.js";
import { useTrackerCheckItem } from "~/hooks/useTrackerCheckItem.js";
import { useTrackerStateStore } from "~/stores/state-store.js";

const props = defineProps<{
  item: any;
}>();

const { position, defaultActive, id } = useTrackerItem(props.item);
const { sheet } = useTrackerCheckItem(props.item);
const trackerStore = useTrackerStore();
const itemSheetImage = trackerStore.itemSheetImage(sheet.value.name);
const itemSheetDimensions = trackerStore.itemSheetDimensions(sheet.value.name);

const stateStore = useTrackerStateStore();
stateStore.init(id.value, {
  checkActive: false,
  active: defaultActive.value,
});

const updateCheckActive = () => {
  stateStore.update(id.value, {
    ...stateStore.get(id.value),
    checkActive: !stateStore.get(id.value).checkActive,
  });
};
const updateActive = () => {
  stateStore.update(id.value, {
    ...stateStore.get(id.value),
    active: !stateStore.get(id.value).active,
  });
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
    @click="updateActive()"
    @contextmenu.prevent="updateCheckActive()"
  >
    <IconItem :item="item" :active="stateStore.get(id).active" />
    <div class="relative">
      <div
        class="absolute -top-[46px] -right-[10px] z-20"
        :class="{ hidden: !stateStore.get(id).checkActive }"
      >
        <ImageCrop
          :image="itemSheetImage"
          :width="itemSheetDimensions.width"
          :height="itemSheetDimensions.height"
          :row="sheet.row"
          :column="sheet.column"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
