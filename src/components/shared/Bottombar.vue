<script setup lang="ts">
import { useRoute } from 'vue-router';
import { bottombarLinks } from "@/constants";


const route = useRoute();
const pathName = route.path
</script>

<template>
    <section className="bottom-bar">
        <router-link v-for="link in bottombarLinks" :key="`bottombar-${link.label}`"
            :to="link.route"
            :className="`${pathName == link.route && 'rounded-[10px] bg-primary-500'} 
            flex-center flex-col gap-1 p-2 transition`">
            <img
            :src="link.imgURL"
            :alt="link.label"
            width={16}
            height={16}
            :className="`${pathName == link.route && 'invert-white'}`"
            />

            <p className="tiny-medium text-light-2">{{link.label}}</p>
        </router-link>
    </section>
</template>