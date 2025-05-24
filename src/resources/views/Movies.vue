<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";

import Paginator from "primevue/paginator";

import LoadingSpinner from "@/resources/components/core/LoadingSpinner.vue";
import MovieCard from "@/resources/components/movie/MovieCard.vue";

import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

import { store } from "@/store";

import { Constants } from "@/constants";

const movies = ref([]);
const first = ref(0);
const rows = ref(6);

const searchTitle = ref("");
const selectedGenres = ref([]);
const sortBy = ref("default");

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

const availableGenres = computed(() => {
  const genreIds = new Set();
  movies.value.forEach(movie => {
    if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      movie.genre_ids.forEach(genreId => {
        if (Constants.GENRE_MAP[genreId]) {
          genreIds.add(genreId);
        }
      });
    }
  });

  return Array.from(genreIds)
    .map(id => ({ id, name: Constants.GENRE_MAP[id] }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

// Filter and sort movies
const filteredAndSortedMovies = computed(() => {
  let result = [...movies.value];

  // Filter by title
  if (searchTitle.value) {
    result = result.filter(movie =>
      movie.title.toLowerCase().includes(searchTitle.value.toLowerCase()) ||
      movie.original_title.toLowerCase().includes(searchTitle.value.toLowerCase())
    );
  }

  // Filter by genre
  if (selectedGenres.value.length > 0) {
    result = result.filter(movie => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        return movie.genre_ids.some(genreId => selectedGenres.value.includes(genreId));
      }
      return false;
    });
  }

  // Sort movies
  switch (sortBy.value) {
    case "default":
      // Keep original order from API
      break;
    case "rating":
      result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      break;
    case "rating_low":
      result.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
      break;
    case "release_date_new":
      result.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
      break;
    case "release_date_old":
      result.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
      break;
  }

  return result;
});

const pagedMovies = computed(() => {
  return filteredAndSortedMovies.value.slice(first.value, first.value + rows.value);
});

function onPage(event) {
  first.value = event.first;
  rows.value = event.rows;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

const resetPagination = () => {
  first.value = 0;
};

watch([searchTitle, selectedGenres, sortBy], resetPagination);

const clearFilters = () => {
  searchTitle.value = "";
  selectedGenres.value = [];
  sortBy.value = "default";
  resetPagination();
};

const resultCount = computed(() => {
  return filteredAndSortedMovies.value.length;
});

// Add state for dropdown visibility
const showGenreDropdown = ref(false);

// Function to toggle genre selection
const toggleGenre = (genreId) => {
  const index = selectedGenres.value.indexOf(genreId);
  if (index > -1) {
    selectedGenres.value.splice(index, 1);
  } else {
    selectedGenres.value.push(genreId);
  }
};

// Function to get selected genre names for display
const selectedGenreNames = computed(() => {
  const genreMap = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
    10759: "Action & Adventure", 10762: "Kids", 10763: "News",
    10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap",
    10767: "Talk", 10768: "War & Politics"
  };

  return selectedGenres.value.map(id => genreMap[id]).filter(Boolean);
});

// Handle clicking outside dropdown to close it
const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown')) {
    showGenreDropdown.value = false;
  }
};

// Handle escape key to close dropdown
const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    showGenreDropdown.value = false;
  }
};

// Add event listeners when component mounts
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

// Clean up event listeners
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<template>
  <article class="container py-4">
    <h1 class="display-4 mb-4 fw-bold">Movies</h1>

    <!-- Search and Filter Section -->
    <section class="search-filters mb-4" v-if="!isLoading">
      <form role="search" aria-label="Search and filter movies">
        <fieldset>
          <legend class="h5 mb-3">Search and Filter Movies</legend>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label for="titleSearch" class="form-label">Search by Title</label>
              <input
                id="titleSearch"
                type="text"
                v-model="searchTitle"
                placeholder="Enter movie title..."
                class="form-control"
                aria-describedby="titleSearch-help"
              />
              <div id="titleSearch-help" class="form-text">Search for movies by title or original title</div>
            </div>

            <div class="col-md-3">
              <label for="genreFilter" class="form-label">Filter by Genre</label>
              <div class="dropdown">
                <button
                  id="genreFilter"
                  class="btn w-100 form-select-style d-flex justify-content-between align-items-center"
                  type="button"
                  @click="showGenreDropdown = !showGenreDropdown"
                  aria-expanded="false"
                  aria-describedby="genreFilter-help"
                  :aria-label="selectedGenres.length > 0 ? `${selectedGenres.length} genres selected` : 'Select genres to filter'"
                >
                  <span>
                    <span v-if="selectedGenres.length === 0" class="text-muted">All Genres</span>
                    <span v-else-if="selectedGenres.length === 1">{{ selectedGenreNames[0] }}</span>
                    <span v-else>{{ selectedGenres.length }} genres selected</span>
                  </span>
                  <i class="bi bi-chevron-down"></i>
                </button>

                <div
                  class="dropdown-menu w-100"
                  :class="{ show: showGenreDropdown }"
                  role="listbox"
                  aria-labelledby="genreFilter"
                >
                  <div class="px-3 py-2 border-bottom">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="selectAll"
                        @change="selectedGenres.length === availableGenres.length ? selectedGenres = [] : selectedGenres = availableGenres.map(g => g.id)"
                        :checked="selectedGenres.length === availableGenres.length"
                        :indeterminate="selectedGenres.length > 0 && selectedGenres.length < availableGenres.length"
                      >
                      <label class="form-check-label fw-bold" for="selectAll">
                        {{ selectedGenres.length === availableGenres.length ? 'Deselect All' : 'Select All' }}
                      </label>
                    </div>
                  </div>

                  <div class="max-height-200 overflow-auto">
                    <div
                      v-for="genre in availableGenres"
                      :key="genre.id"
                      class="px-3 py-1"
                      role="option"
                      :aria-selected="selectedGenres.includes(genre.id)"
                    >
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :id="`genre-${genre.id}`"
                          :value="genre.id"
                          @change="toggleGenre(genre.id)"
                          :checked="selectedGenres.includes(genre.id)"
                        >
                        <label class="form-check-label" :for="`genre-${genre.id}`">
                          {{ genre.name }}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div v-if="selectedGenres.length > 0" class="px-3 py-2 border-top">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="selectedGenres = []"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
              <div id="genreFilter-help" class="form-text">Select multiple genres to filter movies</div>
            </div>

            <div class="col-md-3">
              <label for="sortBy" class="form-label">Sort by</label>
              <select
                id="sortBy"
                v-model="sortBy"
                class="form-select"
                aria-describedby="sortBy-help"
              >
                <option value="default">Default Order</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="rating_low">Rating (Low to High)</option>
                <option value="release_date_new">Release Date (Newest)</option>
                <option value="release_date_old">Release Date (Oldest)</option>
              </select>
              <div id="sortBy-help" class="form-text">Sort movies by different criteria</div>
            </div>

            <div class="col-md-2 d-flex align-items-end">
              <button
                type="button"
                @click="clearFilters"
                class="btn btn-outline-secondary w-100"
                aria-label="Clear all filters and search"
              >
                <i class="bi bi-x-circle me-1"></i>
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Results Summary -->
          <div class="alert alert-info d-flex align-items-center" role="status" aria-live="polite">
            <i class="bi bi-info-circle me-2"></i>
            <span>
              Showing {{ pagedMovies.length }} of {{ resultCount }} movies
              {{ searchTitle || selectedGenres.length > 0 ? '(filtered)' : '' }}
            </span>
          </div>
        </fieldset>
      </form>
    </section>

    <LoadingSpinner
      v-if="isLoading"
      :loadingMessage="'Loading Movies...'"
    />

    <!-- Movies Grid -->
    <section v-else-if="resultCount > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-lg-5 p-md-3">
      <div
        v-for="movie in pagedMovies"
        :key="movie.id"
        class="col"
      >
        <MovieCard :movie="movie" />
      </div>
    </section>

    <!-- No Results -->
    <section v-else-if="!isLoading && resultCount === 0" class="text-center py-5">
      <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>
      <h3 class="mt-3 text-muted">No movies found</h3>
      <p class="text-muted">
        Try adjusting your search criteria or
        <button @click="clearFilters" class="btn btn-link p-0 text-decoration-underline">
          clear all filters
        </button>
      </p>
    </section>

    <!-- Pagination -->
    <div v-if="!isLoading && resultCount > 0" class="d-flex justify-content-center mt-5">
      <Paginator
        :rows="rows"
        :totalRecords="resultCount"
        :rowsPerPageOptions="[3, 6, 9, 12]"
        :showFirstLastPageLink="true"
        :showPageLinks="true"
        :showCurrentPageReport="true"
        @page="onPage"
        aria-label="Movie pagination"
      />
    </div>
  </article>
</template>

<style scoped>
.search-filters {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.alert {
  font-size: 0.95rem;
}

/* Custom dropdown styles */
.dropdown {
  position: relative;
}

.form-select-style {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  text-align: left;
}

.form-select-style:hover {
  border-color: #86b7fe;
}

.form-select-style:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-select-style .bi-chevron-down {
  font-size: 0.75rem;
  color: #6c757d;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  min-width: 100%;
  padding: 0;
  margin: 2px 0 0;
  font-size: 0.9rem;
  color: #212529;
  text-align: left;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-menu.show {
  display: block;
}

.max-height-200 {
  max-height: 200px;
}

.overflow-auto {
  overflow-y: auto;
}

.form-check {
  margin-bottom: 0;
}

.form-check-input:indeterminate {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.dropdown-toggle::after {
  margin-left: auto;
}

.dropdown-menu .form-check-label {
  cursor: pointer;
  padding: 0.25rem 0;
  display: block;
  width: 100%;
}

.dropdown-menu .form-check:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .search-filters .row > div {
    margin-bottom: 1rem;
  }

  .search-filters .col-md-2 {
    margin-top: 1rem;
  }

  .dropdown-menu {
    font-size: 0.85rem;
  }
}
</style>
