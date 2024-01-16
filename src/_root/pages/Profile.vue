<script setup lang="ts">
import GridPostList from '@/components/shared/GridPostList.vue';
import Loader from '@/components/shared/Loader.vue';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context';
import { useGetUserById } from '@/lib/vue-query/queries';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const { id } = useRoute().params;
const { user } = useAuthContext();
const { path } = useRoute();
const pathname = ref(path)

const { data: currentUser } = useGetUserById(id.toString() || "");

const route = useRoute();

  watch(
    () => route.path,
    (newParams, _oldParams) => {
      pathname.value = newParams
    }
  );
</script>

<template>

    <div v-if="!currentUser" className="flex-center w-full h-full">
      <Loader />
    </div>

    <div v-else class="profile-container">
      <div class="profile-inner_container">
        <div class="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            :src="
              currentUser?.imageUrl || '/assets/icons/profile-placeholder.svg'
            "
            alt="profile"
            class="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div class="flex flex-col flex-1 justify-between md:mt-2">
            <div class="flex flex-col w-full">
              <h1 class="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {{currentUser?.name}}
              </h1>
              <p class="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{{currentUser?.username}}
              </p>
            </div>

            <div class="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <div className="flex-center gap-2">
                <p className="small-semibold lg:body-bold text-primary-500">{{currentUser?.posts.length}}</p>
                <p className="small-medium lg:base-medium text-light-2">Posts</p>
              </div>
              <div className="flex-center gap-2">
                <p className="small-semibold lg:body-bold text-primary-500">20</p>
                <p className="small-medium lg:base-medium text-light-2">Followers</p>
              </div>
              <div className="flex-center gap-2">
                <p className="small-semibold lg:body-bold text-primary-500">20</p>
                <p className="small-medium lg:base-medium text-light-2">Following</p>
              </div>
            </div>

            <p class="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {{currentUser?.bio}}
            </p>
          </div>

          <div class="flex justify-center gap-4">
            <div :class="`${user.id !== currentUser?.$id && 'hidden'}`">
              <router-link
                :to="`/update-profile/${currentUser?.$id}`"
                :class="`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser?.$id && 'hidden'
                }`">
                <img
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width="20"
                  height="20"
                />
                <p class="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </router-link>
            </div>
            <div :class="`${user.id === id && 'hidden'}`">
              <Button type="button" class="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

        <div v-if="currentUser?.$id === user.id" class="flex max-w-5xl w-full">
          <router-link
            :to="`/profile/${id}`"
            :class="`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && '!bg-dark-3'
            }`">
            <img
              src="/assets/icons/posts.svg"
              alt="posts"
              width="20"
              height="20"
            />
            Posts
          </router-link>
          <router-link
            :to="`/profile/${id}/liked-posts`"
            :class="`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && '!bg-dark-3'
            }`">
            <img
              src="/assets/icons/like.svg"
              alt="like"
              width="20"
              height="20"
            />
            Liked Posts
          </router-link>
        </div>

        <GridPostList v-if="pathname == `/profile/${id}`"  :posts="currentUser?.posts" :showUser="false" />
        <router-view ></router-view>
    </div>
</template>
