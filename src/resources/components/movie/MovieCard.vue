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
  const max = 100;
  const ovr = props.movie.overview || "";
  return ovr.length > max ? ovr.slice(0, max) + "…" : ovr;
});
</script>

<template>
  <div class="movie-card">
    <RouterLink :to="{ name: 'movie-details', params: { id: movie.id } }">
      <img :src="`https://image.tmdb.org/t/p/original/${movie.poster_path}`"
           :alt="movie.title"
           class="movie-image" />

      <div class="movie-details">
        <h2 class="movie-title">{{ movie.title }}</h2>

        <p class="movie-overview">{{ truncatedOverview }}</p>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.movie-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.movie-card a:hover {
  background-color: transparent;
}

.movie-card:hover {
  transform: scale(1.02);
}

.movie-image {
  width: 100%;
  height: auto;
  display: block;
}

.movie-details {
  padding: 16px;
}

.movie-title {
  font-size: 1rem;
  margin: 0 0 8px;
}

.movie-overview {
  font-size: 1rem;
  color: #555;
}
</style>
