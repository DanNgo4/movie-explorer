<script setup>
import { ref, computed, onMounted } from "vue";

import { store } from "@/store";

import { Constants } from "@/constants";

const firstName     = ref("");
const lastName      = ref("");
const selectedImage = ref("mountain");

onMounted(() => {
  console.log(store.movies);
  console.log(store.currentMovie);
});

const welcomeMessage = computed(() => {
  if (firstName.value || lastName.value) {
    const name = [firstName.value, lastName.value].join(" ");

    return `Welcome, ${name}!`;
  }

  return "";
});

const images = {
  mountain : Constants.API_URL_MOUNTAIN_IMAGE,
  ocean    : Constants.API_URL_OCEAN_IMAGE
};
</script>

<template>
  <article class="container-xl px-4 py-5">
    <section class="mb-5">
      <h1 class="display-5 mb-4">About Movie Explorer</h1>

      <p class="lead mb-4">
        Movie Explorer is your ultimate destination for discovering and exploring the world of cinema. My platform provides up-to-date information about movies, from classic masterpieces to the latest releases. Stay informed with my news section and explore the extensive movie database.
      </p>
    </section>

    <section class="mb-5">
      <h2 class="h4 mb-3">Introduce Yourself</h2>

      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label for="firstName" class="form-label">First Name</label>

          <input type="text"
                 id="firstName"
                 v-model="firstName"
                 placeholder="Enter your first name"
                 class="form-control" />
        </div>

        <div class="col-md-6">
          <label for="lastName" class="form-label">Last Name</label>

          <input type="text"
                 id="lastName"
                 v-model="lastName"
                 placeholder="Enter your last name"
                 class="form-control" />
        </div>
      </div>

      <p v-if="welcomeMessage" class="alert alert-success fs-5">
        {{ welcomeMessage }}
      </p>
    </section>

    <section>
      <h2 class="h4 mb-3">Select Your Preferred View</h2>

      <div class="mb-4">
        <div class="form-check form-check-inline">
          <input type="radio"
                 id="mountain"
                 value="mountain"
                 v-model="selectedImage"
                 class="form-check-input" />

          <label for="mountain" class="form-check-label">Mountain View</label>
        </div>

        <div class="form-check form-check-inline">
          <input type="radio"
                 id="ocean"
                 value="ocean"
                 v-model="selectedImage"
                 class="form-check-input" />

          <label for="ocean" class="form-check-label">Ocean View</label>
        </div>
      </div>

      <div class="rounded overflow-hidden shadow-sm">
        <img :src="images[selectedImage]"
             :alt="selectedImage === 'mountain'
               ? 'Mountain landscape'
               : 'Ocean landscape'
             "
             class="w-100 object-fit-cover hover-scale"
             style="max-height: 400px;" />
      </div>
    </section>
  </article>
</template>

<style scoped>
.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>
