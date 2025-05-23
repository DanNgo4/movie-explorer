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

export {
  list,
  retrieve,
};
