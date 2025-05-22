import { store } from "@/store";

import * as MovieService from "../services/movie-service";

async function list() {
  const movies = await MovieService.list();

  store.movies = movies;
}

export {
  list,
};
