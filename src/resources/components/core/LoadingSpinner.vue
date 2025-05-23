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
  <div class="loading-container">
    <span class="spinner"></span>

    <p v-if="loadingMessage" class="loading-message">
      {{ loadingMessage }}
    </p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-message {
  margin: 0 0 0 12px;
  color: #495057;
}
</style>
