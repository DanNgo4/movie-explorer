<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

import { TieredMenu } from "primevue";

const baseUrl = import.meta.env.BASE_URL;

const menuRef = ref(null);

const pages = [
  { label: "Home",   route: "/"     },
  { label: "Movies", route: "/movies"     },
  { label: "News",   route: "/news" },
  { label: "About",  route: "/about" }
];
</script>

<template>
  <header class="d-flex flex-row align-items-center justify-content-between px-5 py-2 bg-primary-subtle">
    <a
      :href="`${baseUrl}`"
      @click.prevent="$router.push('/')"
      class="fs-4 fw-bold bg-transparent cursor-pointer"
    >
      Movie Explorer
    </a>

    <nav class="d-none d-lg-flex gap-3 align-items-center">
      <RouterLink
        v-for="page in pages"
        :key="page.route"
        :to="page.route"
      >
        {{ page.label }}
      </RouterLink>
    </nav>

    <section class="d-none d-lg-flex gap-3 align-items-center">
      <RouterLink :to="'/login'">
        Log In
      </RouterLink>

      <RouterLink id="signup" :to="'/signup'" class="border border-1 border-black px-2 py-1 rounded">
        Sign Up
      </RouterLink>
    </section>

    <section class="d-flex d-lg-none align-items-center">
      <button class="btn btn-link p-0" @click="menuRef.toggle($event)">
        <i class="bi bi-list fs-3"></i>
      </button>

      <TieredMenu
        :model="pages"
        popup
        ref="menuRef"
        class="custom-tiered-menu"
      >
        <template #item="{ item }">
          <RouterLink
            :to="item.route"
            custom
          >
            <a
              :href="`${baseUrl}/#${item.route}`"
            >
              {{ item.label }}
            </a>
          </RouterLink>
        </template>
      </TieredMenu>
    </section>
  </header>
</template>

<style scoped>
.custom-tiered-menu a {
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
}

.custom-tiered-menu a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
