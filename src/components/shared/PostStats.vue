<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Models } from 'appwrite';

// Import your necessary Vue Query hooks here
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from '@/lib/vue-query/queries';
import { checkIsLiked } from '@/lib/utils';
import router from '@/router';

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const { post, userId } = defineProps<PostStatsProps>();

const location = router.currentRoute.value
const likesList = ref(post.likes.map((user: Models.Document) => user.$id));
const likes = ref<string[]>(likesList.value);
const isSaved = ref(false);

// Replace with actual Vue Query hooks and get current user data
const { mutate: likePost } = useLikePost();
const { mutate: savePost } = useSavePost();
const { mutate: deleteSavePost } = useDeleteSavedPost();
const { data: currentUser } = useGetCurrentUser();

const savedPostRecord = ref<any>();

onMounted(() => {
  savedPostRecord.value = currentUser.value?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );
});

watch(currentUser, () => {
  console.log( currentUser.value?.save)
  savedPostRecord.value = currentUser.value?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );
});

const handleLikePost = () => {

  let likesArray = [...likes.value];

  if (likesArray.includes(userId)) {
    likesArray = likesArray.filter((Id) => Id !== userId);
  } else {
    likesArray.push(userId);
  }

  likes.value = likesArray;
  likePost({ postId: post.$id, likesArray });
};

const handleSavePost = () => {
  console.log(savedPostRecord.value)

  if (savedPostRecord.value) {
    isSaved.value = false;
    deleteSavePost(savedPostRecord.value.$id);
    return;
  }

  savePost({ userId: userId, postId: post.$id });
  isSaved.value = true;
};

const containerStyles = location.path.startsWith('/profile')
  ? 'w-full'
  : '';
</script>


<template>
    <div
      :class="`flex justify-between items-center z-20 ${containerStyles}`">
      <div class="flex gap-2 mr-5">
        <img
          :src="`${
            checkIsLiked(likes, userId)
              ? '/assets/icons/liked.svg'
              : '/assets/icons/like.svg'
          }`"
          alt="like"
          width="20"
          height="20"
          @click.stop="handleLikePost"
          class="cursor-pointer"
        />
        <p class="small-medium lg:base-medium">{{likes.length}}</p>
      </div>

      <div class="flex gap-2">
        <img
          :src="isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'"
          alt="share"
          width="20"
          height="20"
          class="cursor-pointer"
          @click.stop="handleSavePost"
        />
      </div>
    </div>
</template>