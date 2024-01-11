<script setup lang="ts">
import Topbar from '@/components/shared/Topbar.vue';
import LeftSidebar from '@/components/shared/LeftSidebar.vue';
import Bottombar from '@/components/shared/Bottombar.vue';
</script>

<template>
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <router-view :key="$route.params[$route.meta.watchParam]"></router-view>
      </section>

      <Bottombar/>
    </div>
</template>