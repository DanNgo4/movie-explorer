<script setup>
import { RouterView } from "vue-router";

import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <NavBar />

  <main class="min-vh-100">
    <RouterView />
  </main>

  <Footer />
</template>
