<script setup>
import { RouterLink } from "vue-router";

import { Constants } from "@/constants";
</script>

<template>
  <article class="container-xl px-4 py-5">
    <section class="py-5 px-3 mb-4 text-center bg-light rounded">
      <h1 class="display-4 mb-3">Welcome to Movie Explorer</h1>

      <p class="lead text-muted">
        Discover, explore, and stay updated with the latest in cinema
      </p>
    </section>

    <section class="row g-4 justify-content-center">
      <div class="col-md-5">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <RouterLink to="/movies">
            <img :src="Constants.API_URL_MOVIE_IMAGE1"
                  alt="Cinema entrance"
                  class="card-img-top"
                  style="height: 250px;" />

            <div class="card-body">
              <h5 class="card-title">Explore Movies</h5>

              <p class="card-text">
                Browse through our extensive collection of movies, from classic films to the latest releases.
              </p>
            </div>
          </RouterLink>
        </div>
      </div>

      <div class="col-md-5">
        <div class="card h-100 border-0 shadow-sm hover-card">
          <RouterLink to="/news">
            <img :src="Constants.API_URL_MOVIE_IMAGE2"
                  alt="Movie theater interior"
                  class="card-img-top"
                  style="height: 250px;" />

          <div class="card-body">
            <h5 class="card-title">Stay Updated</h5>

            <p class="card-text">
              Get the latest news and updates about upcoming releases, reviews, and cinema events.
              </p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.hover-card {
  transition: transform 0.2s;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2) !important;
}

.card a:hover {
  background-color: transparent !important;
}
</style>
