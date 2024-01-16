<script setup lang="ts">
import { convertFileToUrl } from '@/lib/utils';
import { ref } from 'vue';

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const {fieldChange, mediaUrl} = defineProps<ProfileUploaderProps>()

const file = ref<File[]>([])
const fileUrl = ref(mediaUrl);

function onImageDrop(files: File[] | null) {
  if (files?.length) {
    file.value = files
    fieldChange(files);
    fileUrl.value = convertFileToUrl(files[0])
  }
}

function onChange(e: any){
  onImageDrop(e.target.files)
}

</script>
<template>
    <div class="relative">
      <input type="file" class="cursor-pointer w-full h-full opacity-0 absolute top-0 left-0" @change="onChange" />

      <div class="cursor-pointer flex-center gap-4">
        <img
          :src="fileUrl || '/assets/icons/profile-placeholder.svg'"
          alt="image"
          class="h-24 w-24 rounded-full object-cover object-top"
        />
        <p class="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
      </div>
    </div>
</template>