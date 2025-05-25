<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";

import * as UserMutation from "@/infrastructure/mutations/user-mutation";

const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);

const isFormValid = computed(() => {
  return email.value.trim() !== ""
      && password.value.trim() !== "";
});

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password";
    return;
  }

  isLoading.value      = true;
  errorMessage.value   = "";
  successMessage.value = "";

  try {
    const result = await UserMutation.login(email.value, password.value);

    if (result.success) {
      console.log("Login successful:", result.user);
      successMessage.value = "Login successful! Redirecting...";

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      if (result.error === "User not found") {
        errorMessage.value = "No account found with this email. Please sign up to create a new account.";
      } else if (result.error === "Invalid password") {
        errorMessage.value = "Incorrect password. Please try again.";
      } else {
        errorMessage.value = result.error || "Login failed. Please try again.";
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = "An unexpected error occurred. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <article class="container-fluid">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">
            <h2 class="text-center mb-4">Welcome Back</h2>

            <div v-if="successMessage" class="alert alert-success" role="alert" aria-live="polite">
              {{ successMessage }}
            </div>

            <div v-if="errorMessage" class="alert alert-danger" role="alert" aria-live="assertive">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleSubmit">
              <fieldset :disabled="isLoading">
                <legend class="visually-hidden">User Login Form</legend>

                <div class="mb-3">
                  <label for="email" class="form-label">
                    Email Address
                  </label>

                  <input type="email"
                         id="email"
                         v-model="email"
                         required
                         placeholder="Enter your email"
                         autocomplete="email"
                         :disabled="isLoading"
                         class="form-control" />
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">
                    Password
                  </label>

                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'"
                           id="password"
                           v-model="password"
                           required
                           placeholder="Enter your password"
                           autocomplete="current-password"
                           :disabled="isLoading"
                           class="form-control" />

                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      :disabled="isLoading"
                      :aria-label="showPassword ? 'Hide password' : 'Show password'"
                      :aria-pressed="showPassword"
                      class="btn btn-outline-secondary"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="!isFormValid || isLoading"
                  class="btn btn-primary w-100 mb-3"
                >
                  <span
                    v-if="isLoading"
                    role="status"
                    aria-hidden="true"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>

                  {{ isLoading ? 'Logging in...' : 'Log In' }}
                </button>

                <p class="text-center mb-0">
                  Don't have an account?

                  <RouterLink
                    to="/signup"
                    class="text-decoration-underline text-primary"
                  >
                    Sign Up
                  </RouterLink>
                </p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.container-fluid {
  background-color: #f8f9fa;
}

.card {
  border-radius: 1rem;
}

.btn-primary {
  padding: 0.75rem;
}
</style>
