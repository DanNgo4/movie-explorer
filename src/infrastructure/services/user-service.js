import { Constants } from "@/constants";

async function add(model) {
  try {
    await fetch(`${Constants.API_URL_USER}/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(model)
    });

    return Promise.resolve();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function authenticate(email, password) {
  try {
    const user = await retrieve(email);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.password !== password) {
      return { success: false, error: "Invalid password" };
    }

    const { password: _, ...userWithoutPassword } = user;

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Authentication failed" };
  }
}

async function retrieve(email) {
  try {
    const response = await fetch(`${Constants.API_URL_USER}/email/${email}`);

    const result = await response.json();
    return result[0];
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export {
  add,
  authenticate,
  retrieve,
};
