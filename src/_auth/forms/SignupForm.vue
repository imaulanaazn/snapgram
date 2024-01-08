<script setup lang="ts">
import router from '@/router';
import Loader from "../../components/shared/Loader.vue"
import { useForm } from 'vee-validate'
import { useToast } from '@/components/ui/toast/use-toast'
import {SignupValidation} from "@/lib/validation"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import { useCreateUserAccount, useSignInAccount } from '@/lib/vue-query/queries';
import { useAuthContext } from '@/context/index';
import { INewUser } from '@/types';

const { toast } = useToast()
const authContext = useAuthContext();

const isUserLoading = authContext.isLoading

const form = useForm({
  validationSchema: SignupValidation,
  initialValues: {
    name: "",
    username: "",
    email: "",
    password: "",
  }
})

 // Queries
const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();

// Handler
const handleSignup = async (user: INewUser) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ title: "Sign up failed. Please try again.", });
        
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account", });
        
        router.push("/sign-in");
        
        return;
      }

      const isLoggedIn = await authContext.checkAuthUser();

      if (isLoggedIn) {
        form.resetForm()
        
        router.push("/");
      } else {
        toast({ title: "Login failed. Please try again.", });
        
        return;
      }
    } catch (error) {
      console.log("HEHE" + { error });
    }
  };

const onSubmit = form.handleSubmit((values) => {
    handleSignup(values)
})

</script>

<template>
    <div class="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 class="h3-bold md:h2-bold pt-5 sm:pt-12">
        Create a new account
        </h2>
        <p class="text-light-3 small-medium md:base-regular mt-2">
        To use snapgram, Please enter your details
        </p>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-5 w-full mt-4">
            <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                    <FormLabel className="shad-form_label">Name</FormLabel>
                        <FormControl>
                            <Input type="text" class="shad-input" v-bind="componentField" />
                        </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                        <FormControl>
                            <Input type="text" class="shad-input" v-bind="componentField" />
                        </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                    <FormLabel className="shad-form_label">Email</FormLabel>
                        <FormControl>
                            <Input type="email" class="shad-input" v-bind="componentField" />
                        </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                    <FormLabel className="shad-form_label">Password</FormLabel>
                        <FormControl>
                            <Input type="password" class="shad-input" v-bind="componentField" />
                        </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button type="submit" class="shad-button_primary">
                <div v-if="isCreatingAccount || isSigningInUser || isUserLoading" class="flex-center gap-2">
                    <Loader /> Loading...
                </div>
                <span v-else>Sign up</span>
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">
                Already have an account?
                <router-link 
                to="/sign-in"
                className="text-primary-500 text-small-semibold ml-1">
                    Log in
                </router-link >
            </p>
        </form>   
    </div>
</template>