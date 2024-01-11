<script setup lang="ts">
import { useAuthContext } from '@/context';
import PostStats from './PostStats.vue';
import { Models } from 'appwrite';


type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const {
    posts,
    showUser = true,
    showStats = true,
} = defineProps<GridPostListProps>()

const { user } = useAuthContext();
</script>

<template>
    <ul class="grid-container">
        <li v-for="post in posts" :key="post.$id" class="relative min-w-80 h-80">
          <router-link :to="`/posts/${post.$id}`" class="grid-post_link">
            <img
              :src="post.imageUrl"
              alt="post"
              class="h-full w-full object-cover"
            />
          </router-link>

          <div class="grid-post_user">
              <div v-if="showUser" class="flex items-center justify-start gap-2 flex-1">
                <img
                  :src="post.creator.imageUrl ||
                    '/assets/icons/profile-placeholder.svg'"
                  alt="creator"
                  class="w-8 h-8 rounded-full"
                />
                <p class="line-clamp-1">{{post.creator.name}}</p>
              </div>
            <PostStats v-if="showStats" :post="post" :userId="user.id" />
          </div>
        </li>
    </ul>
</template>