<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import router from '@/router';
    const isAuthenticated = ref(false)
    
    onMounted(()=>{
        if(isAuthenticated.value){
            router.push('/')
        }
    })
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