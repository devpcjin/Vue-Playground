<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <NavBar />
  <main
    class="w-full max-w-6xl min-h-[60vh] mx-auto pt-[120px] px-8 pb-8 text-center flex flex-col items-center justify-center"
  >
    <router-view />
  </main>
</template>
