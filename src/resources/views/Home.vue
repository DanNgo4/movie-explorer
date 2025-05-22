<script setup>
import { onMounted } from "vue";

import { store } from "@/store";

import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

onMounted(async () => {
  await MovieMutations.list();
  console.log(store.movies);
});
</script>

<template>
  <article class="home-container">
    <section class="hero-section mb-3 text-center">
      <h1 class="display-4 mb-3">Welcome to Movie Explorer</h1>

      <p class="lead">
        Discover, explore, and stay updated with the latest in cinema
      </p>
    </section>

    <section class="row g-4 justify-content-center">
      <div class="col-md-5">
        <div class="card h-100">
          <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
               alt="Cinema entrance"
               class="card-img-top" />

          <div class="card-body">
            <h5 class="card-title">Explore Movies</h5>

            <p class="card-text">
              Browse through our extensive collection of movies, from classic films to the latest releases.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <div class="card h-100">
          <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
               alt="Movie theater interior"
               class="card-img-top" />

          <div class="card-body">
            <h5 class="card-title">Stay Updated</h5>

            <p class="card-text">
              Get the latest news and updates about upcoming releases, reviews, and cinema events.
            </p>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  padding: 3rem 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 250px;
  object-fit: cover;
}

.lead {
  color: #6c757d;
}
</style>
