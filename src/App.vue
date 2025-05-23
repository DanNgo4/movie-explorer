<script setup>
import { RouterView } from "vue-router";

import NavBar from "@/resources/components/core/NavBar.vue";
import Footer from "@/resources/components/core/Footer.vue";
</script>

<template>
  <NavBar />

  <main style="min-height: calc(100vh - 100px);">
    <RouterView />
  </main>

  <Footer />
</template>
