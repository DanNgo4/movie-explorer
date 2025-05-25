<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import Paginator from "primevue/paginator";

import LoadingSpinner from "@/resources/components/core/LoadingSpinner.vue";
import MovieCard from "@/resources/components/movie/MovieCard.vue";

import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

import { store } from "@/store";

import { Constants } from "@/constants";

const router = useRouter();
const route  = useRoute();

const movies = ref([]);
const first  = ref(0);
const rows   = ref(6);

const searchTitle    = ref("");
const selectedGenres = ref([]);
const sortBy         = ref("default");

let isLoading = ref(false);

const initialiseFromQuery = () => {
  const query = route.query;

  if (query.search) {
    searchTitle.value = query.search;
  }

  if (query.genres) {
    const genreIds = query.genres.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    selectedGenres.value = genreIds;
  }

  if (query.sort) {
    sortBy.value = query.sort;
  }

  if (query.rows) {
    const rowsPerPage = parseInt(query.rows);
    if (!isNaN(rowsPerPage) && [3, 6, 9, 12].includes(rowsPerPage)) {
      rows.value = rowsPerPage;
    }
  }

  if (query.page) {
    const page = parseInt(query.page);
    if (!isNaN(page) && page > 0) {
      first.value = (page - 1) * rows.value;
    }
  }
};

const updateQueryParams = () => {
  const query = {};

  if (searchTitle.value) {
    query.search = searchTitle.value;
  }

  if (selectedGenres.value.length > 0) {
    query.genres = selectedGenres.value.join(',');
  }

  if (sortBy.value !== 'default') {
    query.sort = sortBy.value;
  }

  if (first.value > 0) {
    query.page = Math.floor(first.value / rows.value) + 1;
  }

  if (rows.value !== 6) {
    query.rows = rows.value;
  }

  router.replace({ query });
};

onMounted(async () => {
  try {
    isLoading.value = true;

    await MovieMutations.list();
    movies.value = store.movies;

    initialiseFromQuery();

    isLoading.value = false;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
});

const availableGenres = computed(() => {
  const genreIds = new Set();

  movies.value.forEach(movie => {
    if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      movie.genre_ids.forEach(genreId =>
        genreIds.add(genreId)
      );
    }
  });

  return Array.from(genreIds)
              .map(
                id => ({
                  id,
                  name: Constants.GENRE_MAP[id]
                })
              )
              .sort(
                (a, b) => a.name.localeCompare(b.name)
              );
});

const filteredAndSortedMovies = computed(() => {
  let result = [...movies.value];

  if (searchTitle.value) {
    result = result.filter(movie =>
      movie.title.toLowerCase().includes(searchTitle.value.toLowerCase())
   || movie.original_title.toLowerCase().includes(searchTitle.value.toLowerCase())
    );
  }

  if (selectedGenres.value.length > 0) {
    result = result.filter(movie => {
      if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
        return movie.genre_ids.some(genreId => selectedGenres.value.includes(genreId));
      }

      return false;
    });
  }

  switch (sortBy.value) {
    case "default":
      break;
    case "rating":
      result.sort(
        (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
      );
      break;
    case "rating_low":
      result.sort(
        (a, b) => (a.vote_average || 0) - (b.vote_average || 0)
      );
      break;
    case "release_date_new":
      result.sort(
        (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)
      );
      break;
    case "release_date_old":
      result.sort(
        (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0)
      );
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

watch(
  [searchTitle, selectedGenres, sortBy],
  () => {
    resetPagination();
    updateQueryParams();
  },
  { deep: true }
);

watch([first, rows], () => {
  updateQueryParams();
});

const clearFilters = () => {
  searchTitle.value    = "";
  selectedGenres.value = [];
  sortBy.value         = "default";
  resetPagination();

  router.replace({ query: {} });
};

const resultCount = computed(() => {
  return filteredAndSortedMovies.value.length;
});

const showGenreDropdown = ref(false);

const toggleGenre = (genreId) => {
  const index = selectedGenres.value.indexOf(genreId);
  if (index > -1) {
    selectedGenres.value.splice(index, 1);
  } else {
    selectedGenres.value.push(genreId);
  }
};

const selectedGenreNames = computed(() => {
  return selectedGenres.value.map(
    id => Constants.GENRE_MAP[id]
  );
});

const handleClickOutside = (event) => {
  if (!event.target.closest(".dropdown")) {
    showGenreDropdown.value = false;
  }
};

const handleEscapeKey = (event) => {
  if (event.key === "Escape") {
    showGenreDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscapeKey);
});
</script>

<template>
  <article class="container py-4">
    <h1 class="display-4 mb-4 fw-bold">Movies</h1>

    <section class="bg-light p-4 rounded border mb-4" v-if="!isLoading">
      <form role="search" aria-label="Search and filter movies">
        <fieldset>
          <legend class="h5 mb-3">
            Search and Filter Movies
          </legend>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label for="titleSearch" class="form-label">
                Search by Title
              </label>

              <input id="titleSearch"
                     type="text"
                     v-model="searchTitle"
                     placeholder="Enter movie title..."
                     aria-describedby="titleSearch-help"
                     class="form-control" />

              <div id="titleSearch-help" class="form-text">
                Search for movies by title or original title
              </div>
            </div>

            <div class="col-md-3">
              <label for="genreFilter" class="form-label">
                Filter by Genre
              </label>

              <div class="dropdown">
                <button
                  id="genreFilter"
                  type="button"
                  @click="showGenreDropdown = !showGenreDropdown"
                  aria-expanded="false"
                  aria-describedby="genreFilter-help"
                  :aria-label="selectedGenres.length > 0 ? `${selectedGenres.length} genres selected` : 'Select genres to filter'"
                  class="btn w-100 bg-white border border-secondary-subtle rounded d-flex justify-content-between align-items-center text-start px-3 py-1.5 fw-bolder lh-base"
                >
                  <span>
                    <span v-if="selectedGenres.length === 0" class="text-muted">
                      All Genres
                    </span>

                    <span v-else-if="selectedGenres.length === 1">
                      {{ selectedGenreNames[0] }}
                    </span>

                    <span v-else>
                      {{ selectedGenres.length }} genres selected
                    </span>
                  </span>

                  <i class="bi bi-chevron-down text-secondary" style="font-size: 0.75rem;"></i>
                </button>

                <div
                  role="listbox"
                  aria-labelledby="genreFilter"
                  class="position-absolute top-100 start-0 w-100 bg-white border border-secondary-subtle rounded shadow mt-1 p-0 z-1"
                  :class="{ 'd-block': showGenreDropdown, 'd-none': !showGenreDropdown }"
                >
                  <div class="px-3 py-2 border-bottom">
                    <div class="form-check d-flex align-items-center gap-2 mb-0">
                      <input type="checkbox"
                             class="form-check-input"
                             id="selectAll"
                             @change="selectedGenres.length === availableGenres.length
                               ? selectedGenres = []
                               : selectedGenres = availableGenres.map(g => g.id)
                             "
                             :checked="selectedGenres.length === availableGenres.length"
                             :indeterminate="selectedGenres.length > 0 && selectedGenres.length < availableGenres.length" />

                      <label
                        for="selectAll"
                        class="fw-bold d-block w-100 py-1"
                        style="cursor: pointer;"
                      >
                        {{
                          selectedGenres.length === availableGenres.length
                            ? 'Deselect All'
                            : 'Select All'
                        }}
                      </label>
                    </div>
                  </div>

                  <div class="overflow-auto" style="max-height: 200px;">
                    <div
                      v-for="genre in availableGenres"
                      :key="genre.id"
                      role="option"
                      :aria-selected="selectedGenres.includes(genre.id)"
                      class="px-3 py-1"
                    >
                      <div class="form-check d-flex align-items-center gap-2 mb-0">
                        <input type="checkbox"
                               :id="`genre-${genre.id}`"
                               :value="genre.id"
                               @change="toggleGenre(genre.id)"
                               :checked="selectedGenres.includes(genre.id)"
                               class="form-check-input" />

                        <label
                          :for="`genre-${genre.id}`"
                          class="d-block w-100 py-1"
                          style="cursor: pointer;"
                        >
                          {{ genre.name }}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="selectedGenres.length > 0"
                    class="px-3 py-2 border-top"
                  >
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary w-100"
                      @click="selectedGenres = []"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>

              <div id="genreFilter-help" class="form-text">
                Select multiple genres to filter movies
              </div>
            </div>

            <div class="col-md-3">
              <label for="sortBy" class="form-label">Sort by</label>

              <select
                id="sortBy"
                v-model="sortBy"
                aria-describedby="sortBy-help"
                class="form-select"
              >
                <option value="default">Default Order</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="rating_low">Rating (Low to High)</option>
                <option value="release_date_new">Release Date (Newest)</option>
                <option value="release_date_old">Release Date (Oldest)</option>
              </select>

              <div id="sortBy-help" class="form-text">
                Sort movies by different criteria
              </div>
            </div>

            <div class="col-md-2 d-flex align-items-end">
              <button
                type="button"
                @click="clearFilters"
                aria-label="Clear all filters and search"
                class="btn btn-outline-secondary w-100"
              >
                <i class="bi bi-x-circle me-1"></i>

                Clear Filters
              </button>
            </div>
          </div>

          <div
            role="status"
            aria-live="polite"
            class="alert alert-info d-flex align-items-center"
          >
            <i class="bi bi-info-circle me-2"></i>

            <span>
              Showing {{ pagedMovies.length }} of {{ resultCount }} movies
              {{ searchTitle || selectedGenres.length > 0 ? '(filtered)' : '' }}
            </span>
          </div>
        </fieldset>
      </form>
    </section>

    <LoadingSpinner v-if="isLoading"
                    :loadingMessage="'Loading Movies...'" />

    <section
      v-else-if="resultCount > 0"
      class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-3 p-lg-5"
    >
      <div
        v-for="movie in pagedMovies"
        :key="movie.id"
        class="col"
      >
        <MovieCard :movie="movie" />
      </div>
    </section>

    <section
      v-else-if="!isLoading && resultCount === 0"
      class="text-center py-5"
    >
      <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>

      <h3 class="mt-3 text-muted">No movies found</h3>

      <p class="text-muted d-flex justify-content-center align-items-center">
        Try adjusting your search criteria or

        <button
          @click="clearFilters"
          class="btn btn-link p-0 text-decoration-underline ms-1"
        >
          clear all filters
        </button>
      </p>
    </section>

    <Paginator v-if="!isLoading && resultCount > 0"
               :first="first"
               :rows="rows"
               :totalRecords="resultCount"
               :rowsPerPageOptions="[3, 6, 9, 12]"
               :showFirstLastPageLink="true"
               :showPageLinks="true"
               :showCurrentPageReport="true"
               @page="onPage"
               aria-label="Movie pagination" />
  </article>
</template>

<style scoped>
.form-label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.alert {
  font-size: 0.95rem;
}

.dropdown {
  position: relative;
}

.btn:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

.form-check-input:indeterminate {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check:hover {
  background-color: #f8f9fa;
}
</style>
