<script setup lang="ts">
import Loader from '@/components/shared/Loader.vue';
import ProfileUploader from '@/components/shared/ProfileUploader.vue';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { useAuthContext } from '@/context';
import { ProfileValidation } from '@/lib/validation';
import { useGetUserById, useUpdateUser } from '@/lib/vue-query/queries';
import { useForm } from 'vee-validate';
import { useRoute } from 'vue-router';
import router from '@/router';

type ProfileValidation = {
    name: string;
    bio: string;
    file: File[];
    username: string;
    email: string;
}

const { toast } = useToast();
const { id } = useRoute().params;
const { user, setUser } = useAuthContext();

const form = useForm({
validationSchema: ProfileValidation,
initialValues: {
    file: [],
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio || "",
},
});

// Queries
const { data: currentUser } = useGetUserById(id.toString() || "");
const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
useUpdateUser();

// Handler
const handleUpdate = async (value: ProfileValidation) => {
    const updatedUser = await updateUser({
        userId: currentUser.value!.$id,
        name: value.name,
        bio: value.bio,
        file: value.file,
        imageUrl: currentUser.value!.imageUrl,
        imageId: currentUser.value!.imageId,
    });

    if (!updatedUser) {
        toast({
        title: `Update user failed. Please try again.`,
        });
    }

    setUser({
        ...user,
        name: updatedUser?.name,
        bio: updatedUser?.bio,
        imageUrl: updatedUser?.imageUrl,
    });

    router.push(`/profile/${id}`);
};

const onSubmit = form.handleSubmit((values) => {
    handleUpdate(values)
})

</script>

<template>

    <div v-if="!currentUser" className="flex-center w-full h-full">
        <Loader />
    </div>

    <div class="flex flex-1">
      <div class="common-container">
        <div class="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width="36"
            height="36"
            alt="edit"
            class="invert-white"
          />
          <h2 class="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-5 w-full mt-4">
            <FormField v-slot="{ componentField }" name="file">
                <FormItem class="flex">
                        <FormControl>
                            <ProfileUploader
                            :fieldChange="componentField.onChange"
                            :mediaUrl="currentUser?.imageUrl"
                            />
                        </FormControl>
                    <FormMessage class="shad-form_message"/>
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                    <FormLabel class="shad-form_label">Name</FormLabel>
                        <FormControl>
                            <Input type="text" class="shad-input" v-bind="componentField" />
                        </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                    <FormLabel class="shad-form_label">Username</FormLabel>
                        <FormControl>
                            <Input type="text" class="shad-input" v-bind="componentField" disabled/>
                        </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                    <FormLabel class="shad-form_label">Email</FormLabel>
                        <FormControl>
                            <Input type="email" class="shad-input" v-bind="componentField" />
                        </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="bio">
                <FormItem>
                    <FormLabel class="shad-form_label">Bio</FormLabel>
                        <FormControl>
                            <Textarea class="shad-textarea custom-scrollbar" v-bind="componentField">
                            </Textarea>
                        </FormControl>
                    <FormMessage class="shad-form_message" />
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
                :disabled="isLoadingUpdate">
                <Loader v-if="isLoadingUpdate"/>
                Update Profile
              </Button>
            </div>
        </form>   
      </div>
    </div>
</template>