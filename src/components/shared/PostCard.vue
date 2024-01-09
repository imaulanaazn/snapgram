<script setup lang="ts">
import { useAuthContext } from '@/context';
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite';
import PostStats from './PostStats.vue';

type PostCardProps = {
  post: Models.Document;
};

const {post} = defineProps<PostCardProps>()
const {user} = useAuthContext()

</script>

<template v-if="post.creator">
    <div class="post-card">
      <div class="flex-between">
        <div class="flex items-center gap-3">
          <router-link :to="`/profile/${post.creator.$id}`">
            <img
              :src="
                post.creator?.imageUrl ||
                '/assets/icons/profile-placeholder.svg'"
              alt="creator"
              class="w-12 lg:h-12 rounded-full"
            />
          </router-link>

          <div class="flex flex-col">
            <p class="base-medium lg:body-bold text-light-1">
              {{post.creator.name}}
            </p>
            <div class="flex-center gap-2 text-light-3">
              <p class="subtle-semibold lg:small-regular ">
                {{multiFormatDateString(post.$createdAt)}}
              </p>
              •
              <p class="subtle-semibold lg:small-regular">
                {{post.location}}
              </p>
            </div>
          </div>
        </div>

        <router-link 
          :to="`/update-post/${post.$id}`"
          :class="`${user.id !== post.creator.$id && 'hidden'}`">
          <img
            src="/assets/icons/edit.svg"
            alt="edit"
            width={20}
            height={20}
          />
        </router-link>
      </div>

      <router-link  :to="`/posts/${post.$id}`">
        <div class="small-medium lg:base-medium py-5">
          <p>{{post.caption}}</p>
          <ul class="flex gap-1 mt-2">
              <li v-for="(tag, index) in post.tags" :key="`${tag}${index}`" class="text-light-3 small-regular">
                #{{tag}}
              </li>
          </ul>
        </div>

        <img
          :src="post.imageUrl || '/assets/icons/profile-placeholder.svg'"
          alt="post image"
          class="post-card_img"
        />
      </router-link >

      <PostStats v-if="user.id" :post="post" :userId="user.id" />
    </div>
</template>