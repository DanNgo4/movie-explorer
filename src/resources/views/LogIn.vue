<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import * as UserMutation from "@/infrastructure/mutations/user-mutation";

const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const result = await UserMutation.login(email.value, password.value);

    if (result.success) {
      console.log("Login successful:", result.user);

      router.push("/");
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

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  placeholder="Enter your email"
                  autocomplete="email"
                  :disabled="isLoading"
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    :disabled="isLoading"
                  />

                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword"
                    :disabled="isLoading"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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

.form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}
</style>
