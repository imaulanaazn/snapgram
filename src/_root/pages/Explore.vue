<script setup lang="ts">
import GridPostList from '@/components/shared/GridPostList.vue';
import Loader from '@/components/shared/Loader.vue';
import SearchResults from '@/components/shared/SearchResults.vue';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGetPosts, useSearchPosts } from '@/lib/vue-query/queries';
import { useDebounce } from '@vueuse/core';
import { useIntersectionObserver } from '@vueuse/core'
import { computed, ref, watch } from 'vue';

const target = ref(null)
const targetIsVisible = ref(false)
const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

const searchValue = defineModel("")
const debouncedSearch = useDebounce<any>(searchValue, 500);
const debounceVal = computed(()=> debouncedSearch.value)
const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debounceVal);
  
watch([searchValue, targetIsVisible], ()=>{
  if (targetIsVisible.value && !searchValue.value) {
    fetchNextPage();
  }
})

useIntersectionObserver(
  target,
  ([{ isIntersecting }], _observerElement) => {
    targetIsVisible.value = isIntersecting
  },
)

const shouldShowSearchResults = computed(()=> !!searchValue.value);
const shouldShowPosts = !shouldShowSearchResults && 
  posts.value?.pages.every((item) => item.documents.length === 0);
</script>

<template>

  <div v-if="!posts" className="flex-center w-full h-full">
    <Loader />
  </div>

  <div v-else class="explore-container">
    <div class="explore-inner_container">
      <h2 class="h3-bold md:h2-bold w-full">Search Posts</h2>
      <div class="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
        <img
          src="/assets/icons/search.svg"
          width="24"
          height="24"
          alt="search"
        />
        <input v-model="searchValue" type="text" placeholder="Search" :class="cn('explore-search flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50')">
      </div>
    </div>

    <div class="flex-between w-full max-w-5xl mt-16 mb-7">
      <h3 class="body-bold md:h3-bold">Popular Today</h3>

      <div class="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
        <p class="small-medium md:base-medium text-light-2">All</p>
        <img
          src="/assets/icons/filter.svg"
          width="20"
          height="20"
          alt="filter"
        />
      </div>
    </div>

    <div class="flex flex-wrap gap-9 w-full max-w-5xl">
          <SearchResults
              v-if="shouldShowSearchResults"
              :isSearchFetching="isSearchFetching"
              :searchedPosts="searchedPosts"
          />
          <p v-else-if="shouldShowPosts" class="text-light-4 mt-10 text-center w-full">End of posts</p>
          <GridPostList v-else v-for="(item, index) in posts.pages" :key="`page-${index}`" :posts="item.documents" :show-stats="true" :show-user="true"/>
    </div>

  
      <div v-if="hasNextPage && !searchValue" ref="target" class="mt-10">
        <Loader />
      </div>
  </div>
</template>