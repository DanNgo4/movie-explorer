<script setup>
import { ref, computed, onMounted } from "vue";

import { store } from "@/store";

const firstName = ref("");
const lastName = ref("");
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
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
};
</script>

<template>
  <article class="about-container">
    <section class="about-section mb-5">
      <h1 class="display-5 mb-4">About Movie Explorer</h1>

      <p class="lead mb-4">
        Movie Explorer is your ultimate destination for discovering and exploring the world of cinema. My platform provides up-to-date information about movies, from classic masterpieces to the latest releases. Stay informed with my news section and explore the extensive movie database.
      </p>
    </section>

    <section class="user-input-section mb-5">
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

      <div v-if="welcomeMessage" class="welcome-message alert alert-success">
        {{ welcomeMessage }}
      </div>
    </section>

    <section class="image-selection-section">
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

      <div class="selected-image-container">
        <img :src="images[selectedImage]"
             :alt="selectedImage === 'mountain'
               ? 'Mountain landscape'
               : 'Ocean landscape'
             "
             class="selected-image" />
      </div>
    </section>
  </article>
</template>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-message {
  font-size: 1.2rem;
}

.selected-image-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.selected-image:hover {
  transform: scale(1.02);
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
