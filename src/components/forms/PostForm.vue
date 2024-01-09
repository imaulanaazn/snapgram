<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Textarea} from '@/components/ui/textarea'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import router from '@/router';
import { Models } from 'appwrite';
import { useToast } from '../ui/toast';
import { useAuthContext } from '@/context';
import { PostValidation } from '@/lib/validation';
import { useForm } from 'vee-validate';
import { useCreatePost, useUpdatePost } from '@/lib/vue-query/queries';
import FileUploader from '../shared/FileUploader.vue';
import Loader from '../shared/Loader.vue';

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

type FormValue = {
    caption: string;
    file: File[];
    location: string;
    tags: string;
}


const {post, action} = defineProps<PostFormProps>()

  const { toast } = useToast();
  const { user } = useAuthContext();
  const form = useForm({
    validationSchema: PostValidation,
    initialValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
  }
  });

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleSubmit = async (value: FormValue) => {
    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return router.push(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    router.push("/");
  };

  const onSubmit = form.handleSubmit((values) => {
    handleSubmit(values)
  })
</script>

<template>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField v-slot="{ componentField }" name="caption">
            <FormItem>
                <FormLabel class="shad-form_label">Caption</FormLabel>
                    <FormControl>
                        <Textarea 
                        class="shad-textarea custom-scrollbar"
                        v-bind="componentField"
                        />
                    </FormControl>
                <FormMessage  class="shad-form_message"/>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="file">
            <FormItem>
                <FormLabel class="shad-form_label">Add Photos</FormLabel>
                    <FormControl>
                        <FileUploader
                            :fieldChange="componentField.onChange"
                            :mediaUrl="post?.imageUrl"
                        />
                    </FormControl>
                <FormMessage  class="shad-form_message"/>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="location">
            <FormItem>
                <FormLabel class="shad-form_label">Add Location</FormLabel>
                <FormControl>
                    <Input type="text" class="shad-input" v-bind="componentField" />
                </FormControl>
                <FormMessage  class="shad-form_message"/>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="tags">
            <FormItem>
                <FormLabel class="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
                <FormControl>
                    <Input  placeholder="Art, Expression, Learn" type="text" class="shad-input" v-bind="componentField" />
                </FormControl>
                <FormMessage  class="shad-form_message"/>
            </FormItem>
        </FormField>

        <div class="flex gap-4 items-center justify-end">
          <Button
            type="button"
            class="shad-button_dark_4"
            @click="router.go(-1)">
                Cancel
          </Button>
          <Button
            type="submit"
            class="shad-button_primary whitespace-nowrap"
            :disabled="isLoadingCreate || isLoadingUpdate">
                <Loader v-if="isLoadingCreate || isLoadingUpdate"/>
                <span v-else>{{action}}</span> 
          </Button>
        </div>
    </form>
</template>