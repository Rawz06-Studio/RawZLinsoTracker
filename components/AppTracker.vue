<script setup lang="ts">
import { useTrackerStore } from "~/stores/tracker-store.js";
import { useSocket } from "~/hooks/useSocket.js";
import { useTrackerStateStore } from "~/stores/state-store.js";
import ItemList from "~/components/items/ItemList.vue";
import { useListenKey } from "~/hooks/useListenKey.js";
import { useHiddenScrollBarOnSmallWindow } from "~/hooks/useHiddenScrollBarOnSmallWindow.js";

const props = defineProps<{
  tracker: string;
  id?: string;
  isSmallWindow?: any;
}>();

const loaded = ref(false);
const dimensions = ref(null);
const background = ref("");
const backgroundColor = ref("");
const isOpen = ref(false);
const isErrorOpen = ref(false);
const errorArgs = ref(null);

const trackerStore = useTrackerStore();
const stateStore = useTrackerStateStore();
stateStore.setName(props.tracker);
trackerStore.load(props.tracker).then((status) => {
  loaded.value = status;
  const dim = trackerStore.dimensions();
  const bg = trackerStore.background();
  const bgColor = trackerStore.backgroundColor();

  dimensions.value = dim;
  background.value = bg;
  backgroundColor.value = bgColor;
});

if (props.id) {
  useSocket(props.id, function (name) {
    errorArgs.value = name;
    isErrorOpen.value = true;
  });
}

const reset = () => {
  isOpen.value = false;
  if (props.id) {
    fetch("/api/tracker/" + props.id.toLocaleLowerCase(), {
      method: "DELETE",
    }).then(() => {
      reloadNuxtApp();
    });
  } else {
    reloadNuxtApp();
  }
};

const goBackOffline = async () => {
  errorArgs.value = null;
  isErrorOpen.value = false;
  await navigateTo(`/${props.tracker}`);
};

useListenKey(true, true, "r", () => reset());
useHiddenScrollBarOnSmallWindow(props.isSmallWindow);
</script>

<template>
  <div v-if="loaded" class="">
    <div
      class="relative"
      :style="{
        backgroundColor: backgroundColor,
        width: dimensions.width + 'px',
        height: dimensions.height + 'px',
      }"
    >
      <ItemList :is-small-window="isSmallWindow" />
      <img :src="background" alt="Background" class="absolute inset-0 z-0" />
    </div>
  </div>
  <div v-else>Loading...</div>
  <!--  <pre>{{JSON.stringify({-->
  <!--    // global: stateStore.getState(),-->
  <!--    state: stateStore.trackerState-->
  <!--  }, null, 4)}}</pre>-->
  <UModal
    v-model:open="isOpen"
    title="Are you sure you want to reset this tracker?"
  >
    <template #body>
      <div class="flex justify-end gap-4">
        <UButton
          label="No"
          icon="i-heroicons-x-mark"
          size="sm"
          color="primary"
          variant="outline"
          @click="isOpen = false"
        />
        <UButton
          label="Yes"
          icon="i-heroicons-check"
          size="sm"
          color="error"
          @click="reset()"
        />
      </div>
    </template>
  </UModal>

  <UModal v-model:open="isErrorOpen">
    <template #title>
      <span v-if="errorArgs === 'error'">
        The limit of available tracker online has been reached.
      </span>
      <span v-if="errorArgs === 'name'">
        The tracker with id {{ props.id }} is not tracker {{ props.tracker }}.
        Please connect with correct tracker
      </span>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <UButton
          label="Close and back to offline"
          icon="i-fa6-solid-arrow-rotate-left"
          size="sm"
          color="primary"
          variant="outline"
          @click="goBackOffline()"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
