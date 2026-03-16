<script setup>
import {useDefaultFont} from "~/hooks/useCustomFont.js";
const trackers = ["compact", "compactrsl", 'compacttp', 'compactpot', 'oot64']
const trackersInfo = ref({})
const currentHover = ref('')

const load = async (trackerName) => {
  return fetch('/sources/' + trackerName + '/tracker.json').then(async (res) => {
    try {
      return await res.json();
    } catch (error) {
      return null
    }
  }).catch(() => null)
};

trackers.forEach((tracker) => {
  load(tracker).then((info) => trackersInfo.value[tracker] = {
    name: info[0].Informations.Name,
    creator: info[0].Informations.Creator,
    version: info[0].Informations.Version,
    description: info[0].Informations.Comments
  })
})

useDefaultFont();

useHead({
  title: 'RawZLinsoTracker',
  meta: [
    { name: 'description', content: 'An Online version of LinsoTracker' }
  ]
})

const handleOpenTracker = async (tracker) => {
  await navigateTo(`${useRequestURL().origin}/${tracker}`, {external: true})
}
</script>

<template>
<div class="relative w-[1280px] h-[720px]">
  <img src="/default/background.png" alt="Background" class="absolute inset-0 z-0">
  <div :style="{fontFamily: 'ViceCitySans'}" class="z-10 relative text-sm text-gray-100">
    <p>Based on LinSoTracker 2.2 - Developed by LinSoraK</p>
    <p>Web Version 2.0 - Developed by RawZ06</p>
    <p class="text-red-500 font-bold">Only for Restream use, please use Linsotracker app for personal use</p>
  </div>
  <div class="relative h-[510px] top-[60px] z-10 flex justify-between">
    <div class="mt-10 ml-10 grid grid-cols-5 grid-rows-4">
      <NuxtLink @click="handleOpenTracker(tracker)" v-for="tracker of trackers" class="relative w-[122px] h-[122px] grid place-items-center group cursor-pointer" @mouseenter="currentHover = tracker" @mouseleave="currentHover = ''">
        <img :src="`/sources/${tracker}/icon.png`" alt="Background" class="z-30 row-start-1 col-start-1 translate-y-[-5px]">
        <img :src="`/default/glow-official.png`" alt="Glow" class="z-20 row-start-1 col-start-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <img :src="`/default/menu-official.png`" alt="Menu" class="z-20 row-start-1 col-start-1">
      </NuxtLink>
    </div>
    <div class="w-1/2">
      <div v-if="currentHover.length > 0">
        <img :src="`/sources/${currentHover}/illustration.png`" alt="Illustration" class="z-20 w-[600px] h-[500px]">
        <div class="absolute bottom-[10px] bg-gray-500 bg-opacity-40 text-white rounded-lg shadow-lg p-6 backdrop-blur-md w-[600px]">
          <h1 class="text-2xl font-bold mb-2">{{trackersInfo[currentHover].name}}</h1>
          <div class="border-t border-gray-500 my-2"></div>
          <p class="text-sm">
            <span class="font-semibold">Creator :</span> {{trackersInfo[currentHover].creator}}
          </p>
          <p class="text-sm">
            <span class="font-semibold">Version :</span> {{trackersInfo[currentHover].version}}
          </p>
          <p class="text-sm" v-if="trackersInfo[currentHover].description">
            <span class="font-semibold">Description :</span> {{trackersInfo[currentHover].description}}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>