<script setup lang="ts">
import { useGetCurrentUser } from '@/lib/vue-query/queries';
import Loader from './Loader.vue';
import GridPostList from './GridPostList.vue';

const { data: currentUser } = useGetCurrentUser();
</script>
<template>

    <div v-if="!currentUser" className="flex-center w-full h-full">
        <Loader />
    </div>

    <div>
        <p v-if="currentUser?.liked.length === 0" className="text-light-4">No liked posts</p>
        <GridPostList :posts="currentUser?.liked" :showStats="false" />
    </div>
</template>