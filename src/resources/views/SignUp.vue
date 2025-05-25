<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";

import { store } from "@/store";

import * as UserMutation from "@/infrastructure/mutations/user-mutation";

const router = useRouter();

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const showPassword   = ref(false);
const isLoading      = ref(false);
const successMessage = ref("");
const errorMessage   = ref("");

const validateName = (name, field) => {
  if (!name) {
    errors.value[field] = "This field is required";
    return false;
  }

  if (name.length < 2) {
    errors.value[field] = "Must be at least 2 characters";
    return false;
  }

  errors.value[field] = "";
  return true;
};

const validateEmail = (email) => {
  if (!email) {
    errors.value.email = "Email is required";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.value.email = "Please enter a valid email";
    return false;
  }

  errors.value.email = "";
  return true;
};

const validatePassword = (password) => {
  if (!password) {
    errors.value.password = "Password is required";
    return false;
  }

  if (password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    errors.value.password = "Password must contain at least one uppercase letter";
    return false;
  }

  if (!/[a-z]/.test(password)) {
    errors.value.password = "Password must contain at least one lowercase letter";
    return false;
  }

  if (!/[0-9]/.test(password)) {
    errors.value.password = "Password must contain at least one number";
    return false;
  }

  errors.value.password = "";
  return true;
};

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = "Please confirm your password";
    return false;
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match";
    return false;
  }

  errors.value.confirmPassword = "";
  return true;
};

const isValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== "") &&
          Object.values(form.value).every(value => value !== "");
});

const handleSubmit = async () => {
  const isFirstNameValid = validateName(form.value.firstName, "firstName");
  const isLastNameValid = validateName(form.value.lastName, "lastName");
  const isEmailValid = validateEmail(form.value.email);
  const isPasswordValid = validatePassword(form.value.password);
  const isConfirmPasswordValid = validateConfirmPassword();

  if (isFirstNameValid
   && isLastNameValid
   && isEmailValid
   && isPasswordValid
   && isConfirmPasswordValid
  ) {
    isLoading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    try {
      const model = {
        firstName : form.value.firstName,
        lastName  : form.value.lastName,
        email     : form.value.email,
        password  : form.value.password,
      };

      await UserMutation.signup(model);

      console.log("Signup and login successful:", store.currentUser);
      successMessage.value = "Account created successfully! Redirecting...";

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      errorMessage.value = "An unexpected error occurred. Please try again.";
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <article class="container-fluid">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 p-md-5">
            <h2 class="text-center mb-4">Create Account</h2>

            <div v-if="successMessage" class="alert alert-success" role="alert" aria-live="polite">
              {{ successMessage }}
            </div>

            <div v-if="errorMessage" class="alert alert-danger" role="alert" aria-live="assertive">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleSubmit" novalidate>
              <fieldset :disabled="isLoading">
                <legend class="visually-hidden">User Registration Form</legend>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">
                      First Name
                    </label>

                    <input type="text"
                           id="firstName"
                           v-model="form.firstName"
                           @blur="validateName(form.firstName, 'firstName')"
                           required
                           placeholder="Enter your first name"
                           :disabled="isLoading"
                           aria-describedby="firstName-error"
                           class="form-control"
                           :class="{ 'is-invalid': errors.firstName }" />

                    <div class="invalid-feedback" id="firstName-error">
                      {{ errors.firstName }}
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">
                      Last Name
                    </label>

                    <input type="text"
                           id="lastName"
                           v-model="form.lastName"
                           @blur="validateName(form.lastName, 'lastName')"
                           required
                           placeholder="Enter your last name"
                           :disabled="isLoading"
                           aria-describedby="lastName-error"
                           class="form-control"
                           :class="{ 'is-invalid': errors.lastName }" />

                    <div class="invalid-feedback" id="lastName-error">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    id="email"
                    v-model="form.email"
                    @blur="validateEmail(form.email)"
                    required
                    placeholder="Enter your email"
                    autocomplete="email"
                    :disabled="isLoading"
                    aria-describedby="email-error"
                  />

                  <div class="invalid-feedback" id="email-error">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">
                    Password
                  </label>

                  <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'"
                           id="password"
                           v-model="form.password"
                           @blur="validatePassword(form.password)"
                           required
                           placeholder="Enter your password"
                           autocomplete="new-password"
                           :disabled="isLoading"
                           aria-describedby="password-help password-error"
                           class="form-control"
                           :class="{ 'is-invalid': errors.password }" />

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

                    <div class="invalid-feedback" id="password-error">
                      {{ errors.password }}
                    </div>
                  </div>

                  <div class="form-text" id="password-help">
                    Password must be at least 6 characters and contain uppercase, lowercase, and numeric characters.
                  </div>
                </div>

                <div class="mb-4">
                  <label for="confirmPassword" class="form-label">
                    Confirm Password
                  </label>

                  <input :type="showPassword ? 'text' : 'password'"
                         id="confirmPassword"
                         v-model="form.confirmPassword"
                         @blur="validateConfirmPassword"
                         required
                         placeholder="Confirm your password"
                         autocomplete="new-password"
                         :disabled="isLoading"
                         aria-describedby="confirmPassword-error"
                         class="form-control"
                         :class="{ 'is-invalid': errors.confirmPassword }" />

                  <div class="invalid-feedback" id="confirmPassword-error">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="!isValid || isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
                </button>

                <p class="text-center mb-0">
                  Already have an account?

                  <RouterLink
                    to="/login"
                    class="text-decoration-underline text-primary"
                  >
                    Log In
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

.form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.invalid-feedback {
  font-size: 0.875em;
}
</style>
