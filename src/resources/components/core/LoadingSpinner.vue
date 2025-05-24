<script setup>
import { defineProps } from "vue";

const props = defineProps({
  loadingMessage: {
    type: String,
    required: false,
    default: "Loading..."
  },
});</script>

<template>
  <div class="d-flex justify-content-center align-items-center loading-height">
    <span
      role="status"
      aria-hidden="true"
      class="spinner-border text-primary loading-spinner"
    ></span>

    <p v-if="loadingMessage" class="mb-0 ms-3 text-muted">
      {{ loadingMessage }}
    </p>
  </div>
</template>

<style scoped>
.loading-height {
  height: 200px;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
}
</style>
