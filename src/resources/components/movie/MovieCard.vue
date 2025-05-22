<template>
  <div class="movie-card">
    <img
      :src="`https://image.tmdb.org/t/p/original/${movie.poster_path}`"
      :alt="movie.title" class="movie-image" />
    <div class="movie-details">
      <h2 class="movie-title">{{ movie.title }}</h2>
      <p class="movie-description">{{ movie.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.movie-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
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

.movie-description {
  font-size: 1rem;
  color: #555;
}
</style>
