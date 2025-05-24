import { store } from "@/store";

import * as UserService from "../services/user-service";

async function signup(model) {
  const user = await UserService.retrieve(model.email);
  if (user) {
    return { success: false, error: "An account with this email already exists" };
  }

  await UserService.add(model);

  const authResult = await UserService.authenticate(model.email, model.password);

  store.currentUser = authResult.user;
}

async function login(email, password) {
  const authResult = await UserService.authenticate(email, password);

  if (authResult.success) {
    store.currentUser = authResult.user;

    return { success: true, user: authResult.user };
  } else {
    return { success: false, error: authResult.error };
  }
}

async function logout() {
  store.currentUser = null;
}

export {
  signup,
  login,
  logout
};
