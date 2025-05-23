
<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const showPassword = ref(false);

// Validation rules
const validateName = (name, field) => {
  if (!name) {
    errors.value[field] = 'This field is required';
    return false;
  }
  if (name.length < 2) {
    errors.value[field] = 'Must be at least 2 characters';
    return false;
  }
  errors.value[field] = '';
  return true;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.value.email = 'Email is required';
    return false;
  }
  if (!emailRegex.test(email)) {
    errors.value.email = 'Please enter a valid email';
    return false;
  }
  errors.value.email = '';
  return true;
};

const validatePassword = (password) => {
  if (!password) {
    errors.value.password = 'Password is required';
    return false;
  }
  if (password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters';
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    errors.value.password = 'Password must contain at least one uppercase letter';
    return false;
  }
  if (!/[a-z]/.test(password)) {
    errors.value.password = 'Password must contain at least one lowercase letter';
    return false;
  }
  if (!/[0-9]/.test(password)) {
    errors.value.password = 'Password must contain at least one number';
    return false;
  }
  errors.value.password = '';
  return true;
};

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password';
    return false;
  }
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
    return false;
  }
  errors.value.confirmPassword = '';
  return true;
};

const isValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== '') &&
         Object.values(form.value).every(value => value !== '');
});

const handleSubmit = () => {
  const isFirstNameValid = validateName(form.value.firstName, 'firstName');
  const isLastNameValid = validateName(form.value.lastName, 'lastName');
  const isEmailValid = validateEmail(form.value.email);
  const isPasswordValid = validatePassword(form.value.password);
  const isConfirmPasswordValid = validateConfirmPassword();

  if (isFirstNameValid && isLastNameValid && isEmailValid &&
      isPasswordValid && isConfirmPasswordValid) {
    // TODO: Implement signup logic
    console.log('Form submitted:', form.value);
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

            <form @submit.prevent="handleSubmit" novalidate>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="firstName" class="form-label">
                    First Name
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.firstName }"
                    id="firstName"
                    v-model="form.firstName"
                    @blur="validateName(form.firstName, 'firstName')"
                    required
                    placeholder="Enter your first name"
                  />

                  <div class="invalid-feedback">
                    {{ errors.firstName }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.lastName }"
                    id="lastName"
                    v-model="form.lastName"
                    @blur="validateName(form.lastName, 'lastName')"
                    required
                    placeholder="Enter your last name"
                  />
                  <div class="invalid-feedback">{{ errors.lastName }}</div>
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
                />

                <div class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    id="password"
                    v-model="form.password"
                    @blur="validatePassword(form.password)"
                    required
                    placeholder="Enter your password"
                    autocomplete="new-password"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div class="invalid-feedback">{{ errors.password }}</div>
                </div>
              </div>

              <div class="mb-4">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  @blur="validateConfirmPassword"
                  required
                  placeholder="Confirm your password"
                  autocomplete="new-password"
                />
                <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="!isValid"
              >
                Sign Up
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
