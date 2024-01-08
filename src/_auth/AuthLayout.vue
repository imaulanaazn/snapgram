<script setup lang="ts">
import router from '@/router';
import { useAuthContext } from '@/context';

    const {isAuthenticated} = useAuthContext()
    console.log(isAuthenticated)
    
    if(isAuthenticated){
        router.push('/')
    }
</script>

<template v-if="!isAuthenticated">
    <section class="flex flex-1 justify-center items-center flex-col py-10">
        <router-view />
    </section>

    <img
        src="/assets/images/side-img.svg"
        alt="logo"
        class="h-screen w-1/2 object-cover bg-no-repeat hidden xl:block"
    />
</template> 