<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { provideAuthContext } from '@/context/index';

provideAuthContext()
</script>

<template>
  <main class="flex h-screen">
    <RouterView />
    <Toaster />
    <VueQueryDevtools :initialIsOpen="false" />
  </main>
</template>

<style scoped>
</style>
