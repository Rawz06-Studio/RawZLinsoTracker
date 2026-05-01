<template>
  <div :style="cropStyle" class="overflow-hidden z-20 relative" />
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 35,
  },
  height: {
    type: Number,
    default: 35,
  },
  column: {
    type: Number,
    default: 1,
  },
  row: {
    type: Number,
    default: 1,
  },
  image: {
    type: String,
    required: true,
  },
  opacity: {
    type: Number,
    default: 1,
  },
  grayScale: {
    type: Boolean,
    default: false,
  },
});

const cropStyle = computed(() => {
  const offsetX = (props.column - 1) * props.width;
  const offsetY = (props.row - 1) * props.height;

  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundImage: `url(${props.image})`,
    backgroundPosition: `-${offsetX}px -${offsetY}px`,
    backgroundSize: "auto",
    backgroundRepeat: "no-repeat",
    opacity: props.opacity,
    filter: props.grayScale ? "grayscale(100%)" : "none",
  };
});
</script>

<style scoped></style>
