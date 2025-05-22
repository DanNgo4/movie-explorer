<script setup>
import { RouterView } from "vue-router";

import NavBar from "@/resources/components/NavBar.vue";
import Footer from "@/resources/components/Footer.vue";
</script>

<template>
  <NavBar />

  <main class="min-vh-100">
    <RouterView />
  </main>

  <Footer />
</template>
