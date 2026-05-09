<script setup lang="ts">
import ImageCrop from "../utils/ImageCrop.vue";
import { useTrackerItemFunction } from "~/hooks/useTrackerItemFunction.js";

const props = defineProps<{
  item: any;
  active: boolean;
  isMaxLabel: boolean;
}>();
const { sheet, disabledOpacity, label } = useTrackerItemFunction();
const trackerStore = useTrackerStore();
const itemSheetImage = trackerStore.itemSheetImage(
  sheet.value(props.item).name,
);
const itemSheetDimensions = trackerStore.itemSheetDimensions(
  sheet.value(props.item).name,
);
</script>

<template>
  <div v-if="props.item">
    <ImageCrop
      :image="itemSheetImage"
      :width="itemSheetDimensions.width"
      :height="itemSheetDimensions.height"
      :row="sheet(props.item).row"
      :column="sheet(props.item).column"
      :opacity="active ? 1 : disabledOpacity(props.item)"
      :gray-scale="!active"
    />
    <div
      :style="{
        fontFamily: 'evolutionItemFont',
        color: isMaxLabel
          ? 'var(--color-evolutionItemFont-max)'
          : 'var(--color-evolutionItemFont)',
      }"
      class="z-20 absolute top-[20px] right-[0px] select-none text-shadow"
      :class="{ hidden: !label(props.item) || !active }"
    >
      {{ label(props.item) }}
    </div>
  </div>
</template>

<style scoped></style>
