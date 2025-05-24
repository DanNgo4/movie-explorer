const API_URL = `${import.meta.env.BASE_URL}/apis_user.php`;

async function add(userData) {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData)
    });

    return await response.text();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function authenticate(email, password) {
  try {
    const response = await fetch(`${API_URL}/email/${email}`);
    const result = await response.json();

    if (!result || result.length === 0) {
      return { success: false, error: "User not found" };
    }

    const user = result[0];

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
    const response = await fetch(`${API_URL}/email/${email}`);
    const result = await response.json();

    return result[0];
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function update(fieldName, value, userData) {
  try {
    const response = await fetch(`${API_URL}/${fieldName}/${value}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData)
    });

    return await response.text();
  } catch (error) {
      console.error(error);
      return Promise.reject(error);
  }
}

export {
  add,
  authenticate,
  retrieve,
  update,
};
