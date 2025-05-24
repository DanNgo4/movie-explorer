import { reactive, watch } from "vue";

import { Constants } from "./constants";

function loadState() {
  return {
    movies: JSON.parse(
      localStorage.getItem(Constants.LOCAL_STORAGE_MOVIES) || "[]"
    ),
    currentMovie: JSON.parse(
      localStorage.getItem(Constants.LOCAL_STORAGE_CURRENT_MOVIE) || "null"
    ),
    currentUser: JSON.parse(
      localStorage.getItem(Constants.LOCAL_STORAGE_CURRENT_USER) || "null"
    ),
  };
}

export const store = reactive(loadState());

watch(
  () => store.movies,
  newVal => localStorage.setItem(Constants.LOCAL_STORAGE_MOVIES, JSON.stringify(newVal)),
  { deep: true, immediate: true }
);

watch(
  () => store.currentMovie,
  newVal => localStorage.setItem(Constants.LOCAL_STORAGE_CURRENT_MOVIE, JSON.stringify(newVal)),
  { deep: true, immediate: true }
);

watch(
  () => store.currentUser,
  newVal => localStorage.setItem(Constants.LOCAL_STORAGE_CURRENT_USER, JSON.stringify(newVal)),
  { deep: true, immediate: true }
);
