<script setup lang="ts">
import GridPostList from '@/components/shared/GridPostList.vue';
import Loader from '@/components/shared/Loader.vue';
import PostStats from '@/components/shared/PostStats.vue';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context';
import { multiFormatDateString } from '@/lib/utils';
import { useDeletePost, useGetPostById, useGetUserPosts } from '@/lib/vue-query/queries';
import router from '@/router';
import { Models } from 'appwrite';
import { watch,computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()

const { user } = useAuthContext();
const relatedPosts = ref<Models.Document[] | undefined>([])
const postId = computed(()=>route.params.id)

const { data: post, isLoading } = useGetPostById(postId);
const creatorPostId = computed(()=>post.value?.creator.$id)

const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(creatorPostId);

const { mutate: deletePost } = useDeletePost();

const handleDeletePost = () => {
    deletePost({ postId: postId.value.toString(), imageId: post.value?.imageId });
    router.go(-1);
};

watch(userPosts, ()=>{
  console.log(postId.value)
  relatedPosts.value = userPosts.value?.documents.filter(
    (userPost:Models.Document) => userPost.$id !== postId.value
  );
})
</script>

<template>
    <div class="post_details-container">
        <div class="hidden md:flex max-w-5xl w-full">
            <Button
            @click="router.go(-1)"
            variant="ghost"
            class="shad-button_ghost">
            <img
                src="/assets/icons/back.svg"
                alt="back"
                width="24"
                height="24"
            />
            <p class="small-medium lg:base-medium">Back</p>
            </Button>
        </div>

        <Loader v-if="isLoading || !post"/>
      
        <div v-else class="post_details-card">
          <img
            :src="post?.imageUrl"
            alt="creator"
            class="post_details-img"
          />

          <div class="post_details-info">
            <div class="flex-between w-full">
              <router-link
                :to="`/profile/${post?.creator.$id}`"
                class="flex items-center gap-3">
                <img
                  :src=" post?.creator.imageUrl ||
                    '/assets/icons/profile-placeholder.svg'"
                  alt="creator"
                  class="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div class="flex gap-1 flex-col">
                  <p class="base-medium lg:body-bold text-light-1">
                    {{post?.creator.name}}
                  </p>
                  <div class="flex-center gap-2 text-light-3">
                    <p class="subtle-semibold lg:small-regular ">
                      {{multiFormatDateString(post?.$createdAt)}}
                    </p>
                    •
                    <p class="subtle-semibold lg:small-regular">
                      {{post?.location}}
                    </p>
                  </div>
                </div>
              </router-link>

              <div class="flex-center gap-4">
                <router-link
                  :to="`/update-post/${post?.$id}`"
                  :class="`${user.id !== post?.creator.$id && 'hidden'}`">
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width="24"
                    height="24"
                  />
                </router-link>

                <Button
                  @click="handleDeletePost"
                  variant="ghost"
                  :class="`ost_details-delete_btn ${
                    user.id !== post?.creator.$id && 'hidden'
                  }`">
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width="24"
                    height="24"
                  />
                </Button>
              </div>
            </div>

            <hr class="border w-full border-dark-4/80" />

            <div class="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{{post?.caption}}</p>
              <ul class="flex gap-1 mt-2">
                  <li
                    v-for="(tag, index) in post?.tags"
                    :key="`${tag}${index}`"
                    class="text-light-3 small-regular">
                    #{{tag}}
                  </li>
              </ul>
            </div>

            <div class="w-full">
              <PostStats :post="post" :userId="user.id" />
            </div>
          </div>
        </div>

        <div class="w-full max-w-5xl">
            <hr class="border w-full border-dark-4/80" />

            <h3 class="body-bold md:h3-bold w-full my-10">
            More Related Posts
            </h3>
            <Loader v-if="isUserPostLoading || !relatedPosts"/>
            <GridPostList v-else :posts="relatedPosts" :showUser="true" :showStats="true" />
        </div>
    </div>
</template>