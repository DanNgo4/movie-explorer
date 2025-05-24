import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "@/resources/views/Home.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Home" }
    },

    {
      path: "/movies",
      name: "movies",
      component: () => import("@/resources/views/Movies.vue"),
      meta: { title: "Movies" }
    },

    {
      path: "/movies/:id",
      name: "movie-details",
      component: () => import("@/resources/views/MovieDetails.vue"),
      props: true,
      meta: { title: "Movie Details" }
    },

    {
      path: "/news",
      name: "news",
      component: () => import("@/resources/views/News.vue"),
      meta: { title: "News" }
    },

    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/resources/views/About.vue"),
      meta: { title: "About" }
    },

    {
      path: "/login",
      name: "login",
      component: () => import("@/resources/views/LogIn.vue"),
      meta: { title: "Log In" }
    },

    {
      path: "/signup",
      name: "signup",
      component: () => import("@/resources/views/SignUp.vue"),
      meta: { title: "Sign Up" }
    },
  ],
});

export default router;
