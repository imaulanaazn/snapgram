<script setup lang="ts">
import UserCard from '@/components/shared/UserCard.vue';
import { useGetUsers } from '@/lib/vue-query/queries';
import { toast } from '@/components/ui/toast';

const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

if (isErrorCreators.value) {
    toast({ title: "Something went wrong." });
}
</script>
<template>
    <div v-if="isErrorCreators"></div>
    <div v-else className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
          <Loader v-if="isLoading && !creators"/>
          <ul v-else className="user-grid">
              <li v-for="creator in creators?.documents" :key="creator?.$id" className="flex-1 min-w-[200px] w-full  ">
                <UserCard :user="creator" />
              </li>
          </ul>
      </div>
    </div>
</template>