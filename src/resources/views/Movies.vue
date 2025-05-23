<script setup>
import { ref, onMounted, computed } from "vue";

import Paginator from "primevue/paginator";

import LoadingSpinner from "@/resources/components/core/LoadingSpinner.vue";
import MovieCard from "@/resources/components/movie/MovieCard.vue";

import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

import { store } from "@/store";

const movies = ref([]);
const first = ref(0);
const rows = ref(6);

let isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;

    await MovieMutations.list();
    movies.value = store.movies;

    isLoading.value = false;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});

const pagedMovies = computed(() => {
  return movies.value.slice(first.value, first.value + rows.value);
});

function onPage(event) {
  first.value = event.first;
  rows.value = event.rows;

  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div class="container py-4">
    <h1 class="display-4 mb-4 fw-bold">Movies</h1>

    <LoadingSpinner
      v-if="isLoading"
      :loadingMessage="'Loading Movies...'"
    />

    <section v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-lg-5 p-md-3">
      <div
        v-for="movie in pagedMovies"
        :key="movie.id"
        class="col"
      >
        <MovieCard :movie="movie" />
      </div>
    </section>

    <div v-if="!isLoading" class="d-flex justify-content-center mt-5">
      <Paginator
        :rows="rows"
        :totalRecords="movies.length"
        :rowsPerPageOptions="[3, 6, 9]"
        :showFirstLastPageLink="true"
        :showPageLinks="true"
        :showCurrentPageReport="true"
        @page="onPage"
      />
    </div>
  </div>
</template>
