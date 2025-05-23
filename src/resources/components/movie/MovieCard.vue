<script setup>
import { defineProps, computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const truncatedOverview = computed(() => {
  const max = 120;
  const ovr = props.movie.overview || "";
  return ovr.length > max ? ovr.slice(0, max) + "…" : ovr;
});
</script>

<template>
  <div class="card h-100 movie-card">
    <RouterLink :to="{ name: 'movie-details', params: { id: movie.id } }" class="text-decoration-none movie-link">
      <img :src="`https://image.tmdb.org/t/p/original/${movie.poster_path}`"
           :alt="movie.title"
           class="card-img-top" />

      <div class="card-body">
        <h5 class="card-title text-dark">
          {{ movie.title }}
        </h5>

        <p class="card-text text-secondary">
          {{ truncatedOverview }}
        </p>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.movie-card {
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.movie-link:hover {
  background-color: transparent !important;
}

.card-img-top {
  height: auto;
  object-fit: cover;
}
</style>
