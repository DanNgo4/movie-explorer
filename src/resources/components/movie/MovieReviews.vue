<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";

import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

import { store } from "@/store";

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
});

const reviewForm = ref({
  review: "",
  rating: 10
});
const isSubmittingReview = ref(false);
const reviewError        = ref("");
const reviewSuccess      = ref("");

const editingReviewId    = ref(null);
const editForm = ref({
  review: "",
  rating: 10
});
const isUpdatingReview   = ref(false);

const deletingReviewId   = ref(null);
const isConfirmingDelete = ref(false);

const userReviewsCount = computed(() => {
  if (!store.currentUser || !props.movie.reviews) {
    return 0;
  }

  return props.movie.reviews.filter(
    review => review.userId === store.currentUser.id
  ).length;
});

const getDisplayName = (review) => {
  if (isCurrentUserReview(review)) {
    return "You";
  }

  return getUserName(review);
};

const getUserName = (review) => {
  if (review.user
   && review.user.firstName
   && review.user.lastName
  ) {
    return `${review.user.firstName} ${review.user.lastName}`;
  }

  return `User ${review.userId}`;
};

const isCurrentUserReview = (review) => {
  return store.currentUser
      && review.userId === store.currentUser.id;
};

const submitReview = async () => {
  if (!store.currentUser) {
    reviewError.value = "Please log in to submit a review.";
    return;
  }

  isSubmittingReview.value = true;
  reviewError.value        = "";
  reviewSuccess.value      = "";

  try {
    const model = {
      movieId : props.movie.id,
      userId  : store.currentUser.id,
      review  : reviewForm.value.review.trim(),
      rating  : reviewForm.value.rating
    };

    await MovieMutations.addReview(model);

    reviewSuccess.value     = "Review submitted successfully!";
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

const startEdit = (review) => {
  editingReviewId.value = review.id;
  editForm.value.review = review.review;
  editForm.value.rating = review.rating;
};

const cancelEdit = () => {
  editingReviewId.value = null;
  editForm.value.review = "";
  editForm.value.rating = 10;
};

const updateReview = async (reviewId) => {
  isUpdatingReview.value = true;
  reviewError.value      = "";
  reviewSuccess.value    = "";

  try {
    const model = {
      id      : reviewId,
      movieId : props.movie.id,
      userId  : store.currentUser.id,
      review  : editForm.value.review.trim(),
      rating  : editForm.value.rating
    };

    await MovieMutations.updateReview(model);

    reviewSuccess.value = "Review updated successfully!";
    cancelEdit();

    setTimeout(() => {
      reviewSuccess.value = "";
    }, 3000);
  } catch (error) {
    console.error("Failed to update review:", error);
    reviewError.value = "Failed to update review. Please try again.";
  } finally {
    isUpdatingReview.value = false;
  }
};

const confirmDelete = (reviewId) => {
  deletingReviewId.value = reviewId;
  isConfirmingDelete.value = true;
};

const cancelDelete = () => {
  deletingReviewId.value = null;
  isConfirmingDelete.value = false;
};

const deleteReview = async () => {
  if (!deletingReviewId.value) return;

  try {
    await MovieMutations.deleteReview(deletingReviewId.value);
    reviewSuccess.value = "Review deleted successfully!";
    cancelDelete();

    setTimeout(() => {
      reviewSuccess.value = "";
    }, 3000);
  } catch (error) {
    console.error("Failed to delete review:", error);
    reviewError.value = "Failed to delete review. Please try again.";
  }
};
</script>

<template>
  <div class="card shadow-sm mt-4">
    <div class="card-header">
      <h2 class="h4 mb-0 text-primary">Reviews</h2>
    </div>

    <div class="card-body">
      <div
        v-if="store.currentUser"
        class="mb-4"
      >
        <div
          v-if="userReviewsCount > 0"
          class="alert alert-info mb-3"
        >
          <i class="bi bi-info-circle me-2"></i>

          You have written {{ userReviewsCount }} review {{ userReviewsCount > 1 ? 's' : '' }} for this movie.
        </div>

        <h5 class="mb-3">
          {{ userReviewsCount > 0 ? 'Write Another Review' : 'Write a Review' }}
        </h5>

        <div
          v-if="reviewSuccess"
          role="alert"
          class="alert alert-success"
        >
          {{ reviewSuccess }}
        </div>

        <div
          v-if="reviewError"
          role="alert"
          class="alert alert-danger"
        >
          {{ reviewError }}
        </div>

        <form @submit.prevent="submitReview">
          <fieldset :disabled="isSubmittingReview">
            <legend class="visually-hidden">
              Submit Movie Review
            </legend>

            <div class="mb-3">
              <label for="rating" class="form-label">
                Rating (0-10)
              </label>

              <input type="number"
                     id="rating"
                     v-model.number="reviewForm.rating"
                     min="0"
                     max="10"
                     step="1"
                     :disabled="isSubmittingReview"
                     required
                     aria-describedby="rating-help"
                     class="form-control" />

              <div class="form-text" id="rating-help">
                Rate this movie from 0 (terrible) to 10 (excellent)
              </div>
            </div>

            <div class="mb-3">
              <label for="review" class="form-label">
                Review
              </label>

              <textarea
                id="review"
                v-model="reviewForm.review"
                rows="4"
                placeholder="Write your review here..."
                aria-describedby="review-help"
                class="form-control"
              ></textarea>

              <div class="form-text" id="review-help">
                Share your thoughts about this movie
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmittingReview"
            >
              <span
                v-if="isSubmittingReview"
                role="status"
                aria-hidden="true"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
            </button>
          </fieldset>
        </form>
      </div>

      <div v-else class="alert alert-info mb-4">
        <i class="bi bi-info-circle me-2"></i>

        Please <RouterLink to="/login" class="alert-link text-decoration-underline">log in</RouterLink> to write a review.
      </div>

      <div v-if="movie.reviews && movie.reviews.length > 0">
        <h5 class="mb-3">
          All Reviews ({{ movie.reviews.length }})
        </h5>

        <div
          v-for="review in movie.reviews"
          :key="review.id"
          class="border rounded p-3 mb-3"
          :class="{ 'border-primary bg-primary bg-opacity-10': isCurrentUserReview(review) }"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <strong>{{ getDisplayName(review) }}</strong>

              <span
                v-if="isCurrentUserReview(review)"
                class="badge bg-primary ms-2"
              >
                Your Review
              </span>

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

                <div
                  class="progress mt-1"
                  style="height: 6px; width: 100px;"
                  role="progressbar"
                  :aria-valuenow="review.rating"
                  aria-valuemin="0"
                  aria-valuemax="10"
                  :aria-label="`Rating: ${review.rating} out of 10`"
                >
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

            <div
              v-if="isCurrentUserReview(review)"
              class="d-flex gap-2"
            >
              <button
                v-if="editingReviewId !== review.id"
                @click="startEdit(review)"
                class="btn btn-sm btn-outline-primary"
                :disabled="isUpdatingReview"
              >
                <i class="bi bi-pencil"></i> Edit
              </button>

              <button
                v-if="editingReviewId !== review.id"
                @click="confirmDelete(review.id)"
                class="btn btn-sm btn-outline-danger"
              >
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>

          <div v-if="editingReviewId === review.id">
            <form @submit.prevent="updateReview(review.id)">
              <fieldset :disabled="isUpdatingReview">
                <legend class="visually-hidden">
                  Edit Review
                </legend>

                <div class="mb-3">
                  <label
                    :for="`edit-rating-${review.id}`"
                    class="form-label"
                  >
                    Rating (0-10)
                  </label>

                  <input type="number"
                         :id="`edit-rating-${review.id}`"
                         v-model.number="editForm.rating"
                         min="0"
                         max="10"
                         step="1"
                         :disabled="isUpdatingReview"
                         required
                         aria-describedby="edit-rating-help"
                         class="form-control" />

                  <div class="form-text" id="edit-rating-help">
                    Update your rating from 0 to 10
                  </div>
                </div>

                <div class="mb-3">
                  <label
                    :for="`edit-review-${review.id}`"
                    class="form-label"
                  >
                    Review
                  </label>

                  <textarea
                    :id="`edit-review-${review.id}`"
                    v-model="editForm.review"
                    rows="3"
                    :disabled="isUpdatingReview"
                    aria-describedby="edit-review-help"
                    class="form-control"
                  ></textarea>

                  <div class="form-text" id="edit-review-help">
                    Update your review text
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm"
                    :disabled="isUpdatingReview"
                  >
                    <span
                      v-if="isUpdatingReview"
                      role="status"
                      aria-hidden="true"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>

                    {{ isUpdatingReview ? 'Updating...' : 'Update' }}
                  </button>

                  <button
                    type="button"
                    @click="cancelEdit"
                    class="btn btn-secondary btn-sm"
                    :disabled="isUpdatingReview"
                  >
                    Cancel
                  </button>
                </div>
              </fieldset>
            </form>
          </div>

          <div v-else>
            <p class="mb-0">{{ review.review }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-4">
        <i class="bi bi-chat-quote text-muted" style="font-size: 3rem;"></i>

        <p class="text-muted mt-2">
          No reviews yet. Be the first to review this movie!
        </p>
      </div>
    </div>

    <div
      v-if="isConfirmingDelete"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      class="modal d-block"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="delete-modal-title">
              Confirm Delete
            </h5>

            <button
              type="button"
              class="btn-close"
              @click="cancelDelete"
              aria-label="Close dialog"
            ></button>
          </div>

          <div class="modal-body">
            <p>
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelDelete"
            >
              Cancel
            </button>

            <button
              type="button"
              class="btn btn-danger"
              @click="deleteReview"
              aria-describedby="delete-warning"
            >
              <i class="bi bi-trash"></i> Delete Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
