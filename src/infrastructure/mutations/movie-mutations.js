import { store } from "@/store";

import { Constants } from "@/constants";

import * as MovieService from "../services/movie-service";

async function list() {
  const cachedMovies = localStorage.getItem(Constants.LOCAL_STORAGE_MOVIES);

  if (cachedMovies) {
    store.movies = JSON.parse(cachedMovies);
  } else {
    store.movies = await MovieService.list();

    localStorage.setItem(Constants.LOCAL_STORAGE_MOVIES, JSON.stringify(store.movies));
  }
}

async function retrieve(id) {
  store.currentMovie = await MovieService.retrieve(id);
  localStorage.setItem(Constants.LOCAL_STORAGE_CURRENT_MOVIE, JSON.stringify(store.currentMovie));
}

async function addReview(reviewData) {
  await MovieService.addReview(reviewData);
  retrieve(reviewData.movie_id);
}

async function updateReview(reviewData) {
  await MovieService.updateReview(reviewData);
  retrieve(reviewData.movie_id);
}

async function deleteReview(id) {
  await MovieService.deleteReview(id);
  retrieve(id);
}

export {
  list,
  retrieve,
  addReview,
  updateReview,
  deleteReview,
};
