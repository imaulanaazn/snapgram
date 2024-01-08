<script setup lang="ts">
import { INITIAL_USER, useAuthContext } from '@/context';
import { useSignOutAccount } from '@/lib/vue-query/queries';
import { useRoute } from 'vue-router';
import { sidebarLinks } from "@/constants";
import router from '@/router';
import Loader from './Loader.vue';
import { Button } from '../ui/button';

const route = useRoute();
const pathName = route.path
const { user, setUser, setIsAuthenticated, isLoading } = useAuthContext();

const { mutate: signOut } = useSignOutAccount();

const handleSignOut = async () => {
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    router.push("/sign-in");
};
</script>

<template>
    <nav class="leftsidebar">
      <div class="flex flex-col gap-11">
        <router-link to="/" class="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </router-link>

        <div v-if="isLoading || !user.email" class="h-14">
          <Loader />
        </div>
      
        <router-link  v-else :to="`/profile/${user.id}`" class="flex gap-3 items-center">
          <img
            :src="user.imageUrl || `/assets/icons/profile-placeholder.svg`"
            alt="profile"
            class="h-14 w-14 rounded-full"
          />
          <div class="flex flex-col">
            <p class="body-bold">{{user.name}}</p>
            <p class="small-regular text-light-3">@{{user.username}}</p>
          </div>
        </router-link>

        <ul class="flex flex-col gap-6">
          <li v-for="link in sidebarLinks" :key="link.label"
          :class="`leftsidebar-link group ${link.route == pathName && 'bg-primary-500'}`">
            <router-link
              :to="link.route"
              class="flex gap-4 items-center p-4">
              <img
                :src="link.imgURL"
                :alt="link.label"
                :class="{ 'group-hover:invert-white': true, 'invert-white': link.route == pathName }"
              />
              {{link.label}}
            </router-link>
          </li>
        </ul>
      </div>

      <Button
        variant="ghost"
        class="shad-button_ghost"
        @click.prevent="handleSignOut">
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p class="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
</template>