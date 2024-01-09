<script setup lang="ts">
import Loader from '@/components/shared/Loader.vue';
import PostCard from '@/components/shared/PostCard.vue';
import UserCard from '@/components/shared/UserCard.vue';
import { useGetRecentPosts, useGetUsers } from '@/lib/vue-query/queries';

const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);
</script>

<template>
    <template v-if="isErrorPosts || isErrorCreators">
        <div class="flex flex-1">
            <div class="home-container">
                <p class="body-medium text-light-1">Something bad happened</p>
            </div>
            <div class="home-creators">
                <p class="body-medium text-light-1">Something bad happened</p>
            </div>
        </div>
    </template>

    <template v-else>    
        <div class="flex flex-1">
          <div class="home-container">
            <div class="home-posts">
              <h2 class="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
                <Loader v-if="isPostLoading && !posts" />
                <ul v-else class="flex flex-col flex-1 gap-9 w-full ">
                    <li v-for="post in posts?.documents" :key="post.$id" class="flex justify-center w-full">
                      <PostCard :post="post" />
                    </li>
                </ul>
            </div>
          </div>
    
          <div class="home-creators">
            <h3 class="h3-bold text-light-1">Top Creators</h3>
              <Loader v-if="isUserLoading && !creators"/>
              <ul v-else class="grid 2xl:grid-cols-2 gap-6">
                  <li v-for="creator in creators?.documents" :key="creator?.$id">
                    <UserCard :user="creator" />
                  </li>
              </ul>
          </div>
        </div>
    </template>
</template>