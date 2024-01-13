<script setup lang="ts">
import GridPostList from '@/components/shared/GridPostList.vue';
import Loader from '@/components/shared/Loader.vue';
import { useGetCurrentUser } from '@/lib/vue-query/queries';
import { Models } from 'appwrite';
import { computed } from 'vue';

const { data: currentUser } = useGetCurrentUser();

  const savePosts = computed(()=>currentUser.value?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.value?.imageUrl,
      },
    }))
    .reverse());
</script>

<template>
    <div class="saved-container">
      <div class="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width="36"
          height="36"
          alt="edit"
          class="invert-white"
        />
        <h2 class="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

        <Loader v-if="!currentUser"/>
        <ul v-else class="w-full flex justify-center max-w-5xl gap-9">
            <p v-if="savePosts.length === 0" class="text-light-4">No available posts</p>
            <GridPostList v-else :posts="savePosts" :showStats="false" :showUser="true"/>
        </ul>
    </div>
</template>