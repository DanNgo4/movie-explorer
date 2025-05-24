<script setup>
import { defineProps, computed } from "vue";
import { RouterLink } from "vue-router";

import { Constants } from "@/constants";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const truncatedOverview = computed(() => {
  const max = 120;
  const overview = props.movie.overview || "";

  return overview.length > max
    ? overview.slice(0, max) + "…"
    : overview;
});

const movieRating = computed(() => {
  return props.movie.vote_average ? props.movie.vote_average.toFixed(1) : "N/A";
});

const releaseYear = computed(() => {
  return props.movie.release_date
    ? new Date(props.movie.release_date).getFullYear()
    : "";
});
</script>

<template>
  <div class="card h-100 movie-card">
    <RouterLink
      :to="{ name: 'movie-details', params: { id: movie.id } }"
      class="text-decoration-none movie-link"
      :aria-label="`View details for ${movie.title}${releaseYear ? ` (${releaseYear})` : ''}`"
    >
      <img
        :src="`${Constants.API_URL_MOVIE_POSTER}/${movie.poster_path}`"
        :alt="`${movie.title} movie poster${releaseYear ? ` from ${releaseYear}` : ''}`"
        class="card-img-top"
        loading="lazy"
      />

      <div class="card-body">
        <h3 class="card-title text-dark h5">
          {{ movie.title }}
          <span v-if="releaseYear" class="text-muted fs-6">({{ releaseYear }})</span>
        </h3>

        <div class="d-flex align-items-center mb-2">
          <span
            :class="[
              'badge',
              'me-2',
              movie.vote_average ? 'bg-warning text-dark' : 'bg-secondary text-white'
            ]"
            role="img"
            :aria-label="`Rating: ${movieRating}${movie.vote_average ? ' out of 10' : ''}`"
          >
            <i class="bi bi-star-fill me-1" aria-hidden="true"></i>
            {{ movieRating }}
          </span>
        </div>

        <p class="card-text text-secondary">
          {{ truncatedOverview }}
        </p>

        <span class="visually-hidden">
          Click to view more details about {{ movie.title }}
        </span>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.movie-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.movie-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.movie-card:focus-within {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

.movie-link:hover {
  background-color: transparent !important;
}

.movie-link:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.card-img-top {
  object-fit: cover;
}

.badge {
  font-size: 0.8rem;
}
</style>
