<script setup>
import { RouterView } from "vue-router";

import NavBar from "@/resources/components/core/NavBar.vue";
import Footer from "@/resources/components/core/Footer.vue";
</script>

<template>
  <NavBar />

  <main class="min-vh-100">
    <RouterView />
  </main>

  <Footer />
</template>
