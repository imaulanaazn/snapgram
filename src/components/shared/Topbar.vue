<script setup lang="ts">
import { useAuthContext } from '@/context';
import {watch} from "vue"
import router from '@/router';
import { useSignOutAccount } from '@/lib/vue-query/queries';
import { Button } from '../ui/button';

  const { user } = useAuthContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  watch(isSuccess, ()=>{
      if (isSuccess) router.go(0);
  })
</script>

<template>
    <section class="topbar">
      <div class="flex-between py-4 px-5">
        <router-link to="/" class="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </router-link>

        <div class="flex gap-4">
          <Button
            variant="ghost"
            class="shad-button_ghost"
            @click="signOut">
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <router-link :to="`/profile/${user.id}`" class="flex-center gap-3">
            <img
              :src="user.imageUrl || '/assets/icons/profile-placeholder.svg'"
              alt="profile"
              class="h-8 w-8 rounded-full"
            />
          </router-link>
        </div>
      </div>
    </section>
</template>