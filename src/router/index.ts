import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";
import SigninForm from "../_auth/forms/SigninForm.vue";
import SignupForm from "../_auth/forms/SignupForm.vue";
import RootLayout from "../_root/RootLayout.vue";
import AuthLayout from "../_auth/AuthLayout.vue";
import Home from "../_root/pages/Home.vue";
import CreatePost from "@/_root/pages/CreatePost.vue";
import EditPost from "@/_root/pages/EditPost.vue";
import PostDetails from "@/_root/pages/PostDetails.vue";
import Explore from "@/_root/pages/Explore.vue";

const routes = [
    {
        // Private Routes
        path: '/',
        component: RootLayout,
        children: [
          { path: '', component: Home },
          { path: '/explore', component: Explore },
        //   { path: '/saved', component: Saved },
        //   { path: '/all-users', component: AllUsers },
          { path: '/create-post', component: CreatePost },
          { path: '/update-post/:id', component: EditPost },
          { path: '/posts/:id', component: PostDetails, meta: {
            watchParam: 'id' //
          } },
        //   { path: '/profile/:id', component: Profile },
        //   { path: '/update-profile/:id', component: UpdateProfile }
        ]
      },
      {
        // Public Routes
        path: '/',
        component: AuthLayout,
        children: [
          { path: 'sign-in', component: SigninForm },
          { path: 'sign-up', component: SignupForm }
        ]
      }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router