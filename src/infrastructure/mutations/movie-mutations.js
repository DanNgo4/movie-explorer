import { store } from "@/store";

import * as MovieService from "../services/movie-service";

async function list() {
  if (store.movies.length === 0) {  // if movies are not cached
    store.movies = await MovieService.list();
  }
}

async function retrieve(id) {
  store.currentMovie = await MovieService.retrieve(id);
}

async function addReview(model) {
  await MovieService.addReview(model);

  // refreshes movie details
  retrieve(model.movieId);
}

async function updateReview(model) {
  await MovieService.updateReview(model);

  // refreshes movie details
  retrieve(model.movieId);
}

async function deleteReview(reviewId) {
  await MovieService.deleteReview(reviewId);

  // refreshes movie details
  retrieve(store.currentMovie.id);
}

export {
  list,
  retrieve,
  addReview,
  updateReview,
  deleteReview,
};
