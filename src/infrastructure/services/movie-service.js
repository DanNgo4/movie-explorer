const API_URL = `${import.meta.env.BASE_URL}/apis_movie_review.php`;

async function list() {
  const url = "https://api.themoviedb.org/3/discover/movie?api_key=d83946a92b810bbfb1605d3282f61181&include_adult=false&with_genres=16";

  try {
    let result = [];

    for (let i = 1; i <= 10; i++) {
      const response = await fetch(`${url}&page=${i}`);
      const movies = await response.json();

      result = [...result, ...movies.results];
    }

    return result;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function retrieve(id) {
  const url1 = `https://api.themoviedb.org/3/movie/${id}?api_key=d83946a92b810bbfb1605d3282f61181`;
  const url2 = `${API_URL}/movieId/${id}`;

  try {
    const [response1, response2] = await Promise.all([
      fetch(url1),
      fetch(url2)
    ]);

    if (!response1.ok) {
      throw new Error(`Movie API failed with status: ${response1.status}`);
    }

    const movie = await response1.json();

    let reviews = [];
    if (response2.ok) {
      const responseText = await response2.text();
      if (responseText && responseText.trim() !== "") {
        try {
          reviews = JSON.parse(responseText);
        } catch (error) {
          console.error("Failed to parse reviews response:", error);
          reviews = [];
        }
      }
    } else {
      console.error(`Reviews API failed with status: ${response2.status}`);
    }

    if (reviews && Array.isArray(reviews) && reviews.length > 0) {
      const userApiUrl = `${import.meta.env.BASE_URL}/apis_user.php`;

      const userIds = [...new Set(reviews.map(review => review.userId))];

      const userPromises = userIds.map(async (userId) => {
        try {
          const userResponse = await fetch(`${userApiUrl}/id/${userId}`);
          if (userResponse.ok) {
            const responseText = await userResponse.text();
            if (responseText && responseText.trim() !== "") {
              const userData = JSON.parse(responseText);

              return Array.isArray(userData)
                ? userData[0]
                : userData;
            }
          }
          return {
            id: userId,
            firstName: "Unknown",
            lastName: "User"
          };
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          return {
            id: userId,
            firstName: "Unknown",
            lastName: "User"
          };
        }
      });

      const users = await Promise.all(userPromises);

      const userMap = {};
      users.forEach(user => {
        if (user) {
          userMap[user.id] = user;
        }
      });

      reviews.forEach(review => {
        const user = userMap[review.userId];
        if (user) {
          review.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName
          };
        } else {
          review.user = {
            id: review.userId,
            firstName: "Unknown",
            lastName: "User"
          };
        }
      });
    }

    movie.reviews = reviews || [];
    return movie;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function addReview(reviewData) {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData)
    });

    return await response.text();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function updateReview(reviewData) {
  try {
    const response = await fetch(`${API_URL}/id/${reviewData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData)
    });

    return await response.text();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function deleteReview(id) {
  try {
    const response = await fetch(`${API_URL}/id/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });

    return await response.text();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export {
  list,
  retrieve,
  addReview,
  updateReview,
  deleteReview,
};
