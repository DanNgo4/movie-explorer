<script setup>
import { ref, onMounted, defineProps } from "vue";

import { store } from "@/store";

import { Constants } from "@/constants";

import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

import LoadingSpinner from "@/resources/components/core/LoadingSpinner.vue";
import MovieReviews from "@/resources/components/movie/MovieReviews.vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

const isLoading = ref(true);
const movieId   = Number(props.id);

onMounted(async () => {
  try {
    await MovieMutations.retrieve(movieId);
    document.title = `Movie Details | ${store.currentMovie.title}`;
    console.log("Movie details:", store.currentMovie);

    isLoading.value = false;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
</script>

<template>
  <div class="movie-details py-5">
    <LoadingSpinner v-if="isLoading" :loadingMessage="'Loading Details...'" />

    <article v-else-if="store.currentMovie" class="container">
      <div class="card shadow-sm">
        <div class="row g-0">
          <aside class="col-md-4 col-lg-3 p-3">
            <img :src="`${Constants.API_URL_MOVIE_POSTER2}${store.currentMovie.poster_path}`"
                 :alt="store.currentMovie.title"
                 class="img-fluid rounded shadow-sm" />
          </aside>

          <div class="col-md-8 col-lg-9 p-4">
            <h1 class="display-5 mb-2 fw-bold">
              {{ store.currentMovie.title }}
            </h1>

            <p class="lead fst-italic text-muted mb-4">
              {{ store.currentMovie.tagline }}
            </p>

            <section class="d-flex flex-wrap gap-3 mb-4">
              <span class="badge bg-light text-dark p-2 fs-6">
                {{ formatDate(store.currentMovie.release_date) }}
              </span>

              <span class="badge bg-light text-dark p-2 fs-6">
                {{ store.currentMovie.runtime }} minutes
              </span>

              <span class="badge bg-light text-dark p-2 fs-6">
                &#9733; {{ store.currentMovie.vote_average.toFixed(1) }}
              </span>
            </section>

            <section class="d-flex flex-wrap gap-2 mb-4">
              <span
                v-for="genre in store.currentMovie.genres"
                :key="genre.id"
                class="badge genre bg-primary bg-opacity-10 text-primary p-2 fs-6"
              >
                {{ genre.name }}
              </span>
            </section>

            <section class="bg-light p-4 rounded">
              <h2 class="h4 text-primary mb-3">Overview</h2>

              <p class="text-secondary mb-0">
                {{ store.currentMovie.overview }}
              </p>
            </section>
          </div>
        </div>
      </div>

      <MovieReviews :movie="store.currentMovie"
                    :movie-id="movieId" />
    </article>
  </div>
</template>

<style scoped>
.movie-details {
  background-color: #F8F9FA;
}

.badge {
  font-weight: normal;
}

.genre:hover {
  transition: transform 0.3s ease-in-out;
  transform: scale(1.05);
}
</style>
