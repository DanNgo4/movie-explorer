<script setup>
import { ref } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

import { TieredMenu } from "primevue";

import { store } from "@/store";

import * as UserMutation from "@/infrastructure/mutations/user-mutation";

const baseUrl = import.meta.env.BASE_URL;
const router = useRouter();
const route = useRoute();

const menuRef = ref(null);
const userMenuRef = ref(null);

const pages = [
  { label: "Home",   route: "/"       },
  { label: "Movies", route: "/movies" },
  { label: "News",   route: "/news"   },
  { label: "About",  route: "/about"  }
];

const authPages = [
  { label: "Log In",  route: "/login"  },
  { label: "Sign Up", route: "/signup" }
];

const userMenuItems = [
  {
    label: "Logout",
    icon: "bi bi-box-arrow-right",
    command: () => logout()
  }
];

const logout = () => {
  UserMutation.logout();
  router.push("/");
};
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
        :class="[
          'nav-link',
          'text-decoration-none',
          'px-3',
          'py-2',
          'rounded',
          {
            'active-page': route.path === page.route ||
                          (page.route === '/' && route.path === '/'),
            'text-primary': route.path === page.route ||
                           (page.route === '/' && route.path === '/')
          }
        ]"
      >
        {{ page.label }}
      </RouterLink>
    </nav>

    <section class="d-none d-lg-flex gap-3 align-items-center">
      <div v-if="store.currentUser" class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-person-circle fs-5"></i>
          <span>Hi {{ store.currentUser.firstName }}</span>
        </div>

        <button
          class="btn btn-link p-0 text-decoration-none"
          @click="userMenuRef.toggle($event)"
        >
          <i class="bi bi-chevron-down"></i>
        </button>

        <TieredMenu
          :model="userMenuItems"
          popup
          ref="userMenuRef"
          class="custom-user-menu"
        >
          <template #item="{ item }">
            <a
              @click="item.command"
              class="dropdown-item d-flex align-items-center gap-2"
            >
              <i :class="item.icon"></i> {{ item.label }}
            </a>
          </template>
        </TieredMenu>
      </div>

      <template v-else>
        <RouterLink
          :to="'/login'"
          :class="[
            'nav-link',
            'text-decoration-none',
            'px-3',
            'py-2',
            'rounded',
            {
              'active-page': route.path === '/login',
              'text-primary': route.path === '/login'
            }
          ]"
        >
          Log In
        </RouterLink>

        <RouterLink
          :to="'/signup'"
          :class="[
            'nav-link',
            'text-decoration-none',
            'px-3',
            'py-2',
            'rounded',
            'border',
            'border-dark',
            {
              'active-page': route.path === '/signup',
              'text-primary': route.path === '/signup'
            }
          ]"
        >
          Sign Up
        </RouterLink>
      </template>
    </section>

    <section class="d-flex d-lg-none align-items-center gap-2">
      <div v-if="store.currentUser" class="d-flex align-items-center gap-2">
        <i class="bi bi-person-circle fs-5"></i>
        <span class="small">Hi {{ store.currentUser.firstName }}</span>
      </div>

      <button
        class="btn btn-link p-0"
        @click="menuRef.toggle($event)"
        aria-label="Toggle navigation menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <i class="bi bi-list fs-3"></i>
      </button>

      <TieredMenu
        :model="store.currentUser ? [...pages, ...userMenuItems] : [...pages, ...authPages]"
        popup
        ref="menuRef"
        class="custom-tiered-menu"
        id="mobile-menu"
        role="menu"
      >
        <template #item="{ item }">
          <RouterLink
            v-if="item.route"
            :to="item.route"
            custom
            v-slot="{ navigate }"
          >
            <a
              :href="`${baseUrl}/#${item.route}`"
              @click="navigate"
              :class="[
                'mobile-nav-link',
                {
                  'active-mobile-page': route.path === item.route ||
                                       (item.route === '/' && route.path === '/')
                }
              ]"
            >
              {{ item.label }}
            </a>
          </RouterLink>

          <a
            v-else-if="item.command"
            @click="item.command"
            class="dropdown-item d-flex align-items-center gap-2"
          >
            <i :class="item.icon"></i>
            {{ item.label }}
          </a>
        </template>
      </TieredMenu>
    </section>
  </header>
</template>

<style scoped>
.active-page {
  background-color: var(--bs-primary) !important;
  color: white !important;
  font-weight: 600;
}

.nav-link {
  transition: all 0.3s ease;
}

.nav-link:hover:not(.active-page) {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}

.custom-tiered-menu a {
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
}

.custom-tiered-menu a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-nav-link {
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.active-mobile-page {
  background-color: rgba(255, 255, 255, 0.9) !important;
  color: black !important;
  font-weight: 600;
  border-left: 4px solid white;
}

.mobile-nav-link:hover:not(.active-mobile-page) {
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
}

.custom-user-menu .dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.custom-user-menu .dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
