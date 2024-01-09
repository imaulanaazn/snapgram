<script setup lang="ts">
import { Models } from 'appwrite';
import { Button } from '../ui/button';

type UserCardProps = {
  user: Models.Document;
};

const {user} = defineProps<UserCardProps>()

</script>

<template>
    <router-link :to="`/profile/${user.$id}`" class="user-card">
      <img
        :src="user.imageUrl || '/assets/icons/profile-placeholder.svg'"
        alt="creator"
        class="rounded-full w-14 h-14"
      />

      <div class="flex-center flex-col gap-1">
        <p class="base-medium text-light-1 text-center line-clamp-1">
          {{user.name}}
        </p>
        <p class="small-regular text-light-3 text-center line-clamp-1">
          @{{user.username}}
        </p>
      </div>

      <Button type="button" size="sm" class="shad-button_primary px-5">
        Follow
      </Button>
    </router-link>
</template>