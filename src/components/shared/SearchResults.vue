<script setup lang="ts">
import GridPostList from './GridPostList.vue';
import Loader from './Loader.vue';


export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};


const {isSearchFetching, searchedPosts} = defineProps<SearchResultProps>()
</script>

<template>
    <Loader v-if="isSearchFetching" />
    <GridPostList v-else-if="searchedPosts && searchedPosts.documents.length > 0" :posts="searchedPosts.documents"/>
    <p v-else className="text-light-4 mt-10 text-center w-full">No results found</p>
</template>