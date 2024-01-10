<script setup lang="ts">
import { useGetPostById } from '@/lib/vue-query/queries';
import { useRoute } from 'vue-router';
import PostForm from '@/components/forms/PostForm.vue';
import Loader from '@/components/shared/Loader.vue';

const route = useRoute()

const {id} = route.params
const { data: post, isLoading } = useGetPostById(id.toString());
</script>

<template>
    <template v-if="isLoading">
        <div class="flex-center w-full h-full">
            <Loader />
        </div>
    </template>
    <template v-else>
        <div class="flex flex-1">
          <div class="common-container">
            <div class="flex-start gap-3 justify-start w-full max-w-5xl">
              <img
                src="/assets/icons/edit.svg"
                width="36"
                height="36"
                alt="edit"
                class="invert-white"
              />
              <h2 class="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
            </div>
    
            <Loader v-if="isLoading" />
            <PostForm v-else action="Update" :post="post" />
          </div>
        </div>
    </template>
</template>