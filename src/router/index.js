import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Home" }
    },

    {
      path: "/news",
      name: "news",
      component: () => import("@/views/News.vue"),
      meta: { title: "News" }
    },

    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/About.vue"),
      meta: { title: "About" }
    },
  ],
})

export default router
