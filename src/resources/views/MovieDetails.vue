<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";

import { store } from "@/store";

import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

import LoadingSpinner from "@/resources/components/core/LoadingSpinner.vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

const router = useRouter();
const isLoading = ref(true);
const movieId = Number(props.id);

const reviewForm = ref({
  review: "",
  rating: 10
});
const isSubmittingReview = ref(false);
const reviewError = ref("");
const reviewSuccess = ref("");

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

const getDisplayName = (review) => {
  if (isCurrentUserReview(review)) {
    return "You";
  }
  return getUserName(review);
};

const hasUserReviewed = computed(() => {
  if (!store.currentUser || !store.currentMovie.reviews) {
    return false;
  }
  return store.currentMovie.reviews.some(review => review.user_id === store.currentUser.id);
});

const submitReview = async () => {
  if (!store.currentUser) {
    reviewError.value = "Please log in to submit a review.";
    return;
  }

  if (hasUserReviewed.value) {
    reviewError.value = "You have already reviewed this movie.";
    return;
  }

  if (!reviewForm.value.review.trim()) {
    reviewError.value = "Please write a review.";
    return;
  }

  isSubmittingReview.value = true;
  reviewError.value = "";
  reviewSuccess.value = "";

  try {
    const reviewData = {
      movie_id: movieId,
      user_id: store.currentUser.id,
      review: reviewForm.value.review.trim(),
      rating: reviewForm.value.rating
    };

    await MovieMutations.addReview(reviewData);

    reviewSuccess.value = "Review submitted successfully!";
    reviewForm.value.review = "";
    reviewForm.value.rating = 10;

    setTimeout(() => {
      reviewSuccess.value = "";
    }, 3000);
  } catch (error) {
    console.error("Failed to submit review:", error);
    reviewError.value = "Failed to submit review. Please try again.";
  } finally {
    isSubmittingReview.value = false;
  }
};

const getUserName = (review) => {
  if (review.user && review.user.firstName && review.user.lastName) {
    return `${review.user.firstName} ${review.user.lastName}`;
  }
  return `User ${review.user_id}`;
};

const isCurrentUserReview = (review) => {
  return store.currentUser && review.user_id === store.currentUser.id;
};
</script>

<template>
  <div class="movie-details py-5">
    <LoadingSpinner v-if="isLoading" :loadingMessage="'Loading Details...'" />

    <article v-else-if="store.currentMovie" class="container">
      <div class="card shadow-sm">
        <div class="row g-0">
          <aside class="col-md-4 col-lg-3 p-3">
            <img
              :src="`https://image.tmdb.org/t/p/w500${store.currentMovie.poster_path}`"
              :alt="store.currentMovie.title"
              class="img-fluid rounded shadow-sm"
            />
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

      <div class="card shadow-sm mt-4">
        <div class="card-header">
          <h2 class="h4 mb-0 text-primary">Reviews</h2>
        </div>

        <div class="card-body">
          <div v-if="store.currentUser" class="mb-4">
            <div v-if="hasUserReviewed" class="alert alert-info">
              <i class="bi bi-check-circle me-2"></i>
              You have already reviewed this movie. Thank you for your feedback!
            </div>

            <div v-else>
              <h5 class="mb-3">Write a Review</h5>

              <div v-if="reviewSuccess" class="alert alert-success" role="alert">
                {{ reviewSuccess }}
              </div>

              <div v-if="reviewError" class="alert alert-danger" role="alert">
                {{ reviewError }}
              </div>

              <form @submit.prevent="submitReview">
                <div class="mb-3">
                  <label for="rating" class="form-label">Rating (0-10)</label>
                  <input
                    type="number"
                    id="rating"
                    v-model.number="reviewForm.rating"
                    class="form-control"
                    min="0"
                    max="10"
                    step="1"
                    :disabled="isSubmittingReview"
                    required
                  />
                  <div class="form-text">Rate this movie from 0 (terrible) to 10 (excellent)</div>
                </div>

                <div class="mb-3">
                  <label for="review" class="form-label">Review</label>
                  <textarea
                    id="review"
                    v-model="reviewForm.review"
                    class="form-control"
                    rows="4"
                    placeholder="Write your review here..."
                    :disabled="isSubmittingReview"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmittingReview || !reviewForm.review.trim()"
                >
                  <span v-if="isSubmittingReview" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
                </button>
              </form>
            </div>
          </div>

          <div v-else class="alert alert-info mb-4">
            <i class="bi bi-info-circle me-2"></i>
            Please <RouterLink to="/login" class="alert-link">log in</RouterLink> to write a review.
          </div>

          <div v-if="store.currentMovie.reviews && store.currentMovie.reviews.length > 0">
            <h5 class="mb-3">All Reviews ({{ store.currentMovie.reviews.length }})</h5>

            <div
              v-for="review in store.currentMovie.reviews"
              :key="review.id"
              class="border rounded p-3 mb-3"
              :class="{ 'border-primary bg-primary bg-opacity-10': isCurrentUserReview(review) }"
            >
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <strong>{{ getDisplayName(review) }}</strong>
                  <span v-if="isCurrentUserReview(review)" class="badge bg-primary ms-2">Your Review</span>
                  <div class="mt-1">
                    <span
                      class="badge fs-6 px-2 py-1"
                      :class="{
                        'bg-danger': review.rating <= 3,
                        'bg-warning': review.rating > 3 && review.rating <= 6,
                        'bg-success': review.rating > 6
                      }"
                    >
                      {{ review.rating }}/10
                    </span>
                    <div class="progress mt-1" style="height: 6px; width: 100px;">
                      <div
                        class="progress-bar"
                        :class="{
                          'bg-danger': review.rating <= 3,
                          'bg-warning': review.rating > 3 && review.rating <= 6,
                          'bg-success': review.rating > 6
                        }"
                        :style="{ width: (review.rating * 10) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <p class="mb-0">{{ review.review }}</p>
            </div>
          </div>

          <div v-else class="text-center py-4">
            <i class="bi bi-chat-quote text-muted" style="font-size: 3rem;"></i>

            <p class="text-muted mt-2">
              No reviews yet. Be the first to review this movie!
            </p>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.movie-details {
  background-color: #f8f9fa;
}

.badge {
  font-weight: normal;
}

.genre:hover {
  transition: transform 0.3s ease-in-out;
  transform: scale(1.05);
}
</style>
