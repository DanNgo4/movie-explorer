import { store } from "@/store";

import { Constants } from "@/constants";

import * as UserService from "../services/user-service";

async function login(email, password) {
  const authResult = await UserService.authenticate(email, password);

  if (authResult.success) {
    store.currentUser = authResult.user;
    localStorage.setItem(Constants.LOCAL_STORAGE_CURRENT_USER, JSON.stringify(store.currentUser));
    return { success: true, user: authResult.user };
  } else {
    return { success: false, error: authResult.error };
  }
}

async function retrieve(email) {
  store.currentUser = await UserService.retrieve(email);

  localStorage.setItem(Constants.LOCAL_STORAGE_CURRENT_USER, JSON.stringify(store.currentUser));
}

async function signup(userData) {
  try {
    const result = await UserService.add(userData);

    // If signup is successful, automatically log the user in
    if (result) {
      // After successful signup, authenticate the user
      const authResult = await UserService.authenticate(userData.email, userData.password);

      if (authResult.success) {
        store.currentUser = authResult.user;
        localStorage.setItem(Constants.LOCAL_STORAGE_CURRENT_USER, JSON.stringify(store.currentUser));
        return { success: true, user: authResult.user };
      } else {
        // Signup succeeded but login failed - this shouldn't happen normally
        return { success: true, message: 'Account created successfully. Please log in.' };
      }
    } else {
      return { success: false, error: 'Failed to create account' };
    }
  } catch (error) {
    console.error('Signup error:', error);

    // Handle specific error cases
    if (error.message && error.message.includes('email')) {
      return { success: false, error: 'An account with this email already exists' };
    }

    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}

export {
  login,
  retrieve,
  signup,
};
