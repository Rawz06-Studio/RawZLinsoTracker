<script setup>
import Tracker from "~/components/Tracker.vue";
import {useListenKey} from "~/hooks/useListenKey.js";
const route = useRoute()
const tracker = route.params.tracker
const isOpen = ref(false)
const form = reactive({
  name: ""
})

const isSmallWindow = route.query.isSmallWindow

async function onSubmit(event) {
  // Do something with event.data
  event.preventDefault()
  const value = event.data.name;
  form.name = "";
  await navigateTo(`${useRequestURL().origin}/tracker/${tracker}/${value}`, {external: true})
}

useHead({
  title: `Tracker ${tracker}`,
})

useListenKey(true, true, 'l', () => isOpen.value = true)

</script>

<template>
  <div>
    <div v-if="!isSmallWindow" class="mb-2 ml-2">
      <UButton
        label="Go Live" icon="i-heroicons-globe-alt"
        size="sm"
        color="primary"
        @click="isOpen = true"
      />
    </div>
    <Tracker :tracker="tracker" :is-small-window="isSmallWindow" />
    <UModal v-model:open="isOpen" title="Go Live">
      <template #body>
        <UForm :state="form" class="space-y-4" @submit="onSubmit">
          <UFormField label="Name" name="name">
            <UInput v-model="form.name" />
          </UFormField>

          <UButton
            icon="i-heroicons-globe-alt"
            size="sm"
            color="primary"
            type="submit"
          >
            Go
          </UButton>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<style scoped>

</style>