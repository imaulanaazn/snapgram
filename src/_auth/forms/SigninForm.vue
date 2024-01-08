<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import { SigninValidation } from '@/lib/validation'
import { useSignInAccount } from '@/lib/vue-query/queries'
import Loader from '@/components/shared/Loader.vue'
import router from '@/router'
import { useAuthContext } from '@/context'

const {toast} = useToast()
const {checkAuthUser, isLoading:isUserLoading} = useAuthContext();

// Query
const { mutateAsync: signInAccount, isPending:isLoading } = useSignInAccount();

const form = useForm({
  validationSchema: SigninValidation,
  initialValues: {
    email: "",
    password: "",
  }
})

const handleSignin = async (user: {email:string, password: string}) => {
  const session = await signInAccount(user);

  if (!session) {
    toast({ title: "Login failed. Please try again." });
    
    return;
  }

  const isLoggedIn = await checkAuthUser();

  if (isLoggedIn) {
    form.resetForm();

    router.push("/");
  } else {
    toast({ title: "Login failed. Please try again.", });
    
    return;
  }
};

const onSubmit = form.handleSubmit((values) => {
    handleSignin(values)
})
</script>

<template>
    <div class="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 class="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p class="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form @submit="onSubmit"
          class="flex flex-col gap-5 w-full mt-4">
            <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                    <FormLabel className="shad-form_label">Email</FormLabel>
                        <FormControl>
                            <Input type="text" class="shad-input" v-bind="componentField" />
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
                <div v-if="isLoading || isUserLoading" class="flex-center gap-2">
                    <Loader /> Loading...
                </div>

                <span v-else>Log in</span> 
            </Button>

            <p class="text-small-regular text-light-2 text-center mt-2">
                Don&apos;t have an account?
                <router-link
                to="/sign-up"
                class="text-primary-500 text-small-semibold ml-1">
                Sign up
                </router-link>
            </p>
        </form>
      </div>
</template>