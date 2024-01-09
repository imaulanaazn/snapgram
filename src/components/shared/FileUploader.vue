<script setup lang="ts">
import { Button } from '../ui/button';
import { useDropZone } from '@vueuse/core';
import { ref } from 'vue';
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};
const {fieldChange, mediaUrl} = defineProps<FileUploaderProps>()

const fileUrl = ref(mediaUrl)
const file = ref<File[]>([])

const dropZoneRef = ref<HTMLElement>()

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

const { isOverDropZone } = useDropZone(dropZoneRef, { dataTypes: ['image/png','image/jpg','image/jpeg'], onDrop: onImageDrop })

</script>

<template>
    <div 
    :class="`flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer relative ${isOverDropZone && 'bg-dark-4'} `">
    <input ref="dropZoneRef" type="file" @change="onChange" class="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer">
        <div  v-if="fileUrl">
            <div class="flex flex-1 justify-center w-full p-5 lg:p-10">
              <img :src="fileUrl" alt="image" class="file_uploader-img" />
            </div>
            <p class="file_uploader-label">Click or drag photo to replace</p>
        </div>

        <div v-else class="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width="96"
            height="77"
            alt="file upload"
          />

          <h3 class="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p class="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button type="button" class="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
    </div>
</template>