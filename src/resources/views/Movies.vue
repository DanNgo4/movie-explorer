<script setup>
import { ref, onMounted, computed } from "vue";
import Paginator from "primevue/paginator";
import MovieCard from "@/resources/components/movie/MovieCard.vue";
import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";
import { store } from "@/store";

const movies = ref([]);
const first = ref(0);
const rows = ref(9);

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
  <div class="movies-container">
    <h1 class="mb-4">Movies</h1>

    <div v-if="isLoading" class="loading-container d-flex gap-3">
      <span class="spinner"></span>

      <p>Loading movies...</p>
    </div>

    <section v-else class="movies-list">
      <div v-for="movie in pagedMovies" :key="movie.id" class="mb-4">
        <MovieCard :movie="movie" />
      </div>
    </section>

    <Paginator
      v-if="!isLoading"
      :rows="rows"
      :totalRecords="movies.length"
      :rowsPerPageOptions="[3, 6, 9]"
      :showFirstLastPageLink="true"
      :showPageLinks="true"
      :showCurrentPageReport="true"
      @page="onPage"
      class="mt-3"
    />
  </div>
</template>

<style scoped>
.movies-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.movies-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
