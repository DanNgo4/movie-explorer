import { Constants } from "@/constants";

async function list() {
  try {
    let result = [];

    for (let i = 1; i <= 10; i++) {
      const response = await fetch(`${Constants.API_URL_MOVIE_LIST}&page=${i}`);
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
  const movieByIdUrl   = `${Constants.API_URL_MOVIE}/${id}?api_key=${Constants.TMDB_API_KEY}`;
  const movieReviewUrl = `${Constants.API_URL_MOVIE_REVIEW}/movieId/${id}`;

  try {
    const [response1, response2] = await Promise.all([
      fetch(movieByIdUrl),
      fetch(movieReviewUrl)
    ]);

    if (!response1.ok) {
      throw new Error(`Movie API failed with status: ${response1.status}`);
    }

    const movie = await response1.json();

    let reviews = [];

    if (response2.ok) {
      const response = await response2.json();

      if (Array.isArray(response)) {
        reviews = response;
      }
    } else {
      throw new Error(`Reviews API failed with status: ${response2.status}`);
    }

    if (reviews && Array.isArray(reviews) && reviews.length > 0) {
      const userIds = [...new Set(reviews.map(review => review.userId))];

      const userPromises = userIds.map(async (userId) => {
        try {
          const userResponse = await fetch(`${Constants.API_URL_USER}/id/${userId}`);
          if (userResponse.ok) {
            const response = await userResponse.json();
            if (response.length > 0) {
              return response[0];
            }
          }

          return {
            id        : userId,
            firstName : "Unknown",
            lastName  : "User"
          };
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          return {
            id        : userId,
            firstName : "Unknown",
            lastName  : "User"
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
            id        : user.id,
            firstName : user.firstName,
            lastName  : user.lastName
          };
        } else {
          review.user = {
            id        : review.userId,
            firstName : "Unknown",
            lastName  : "User"
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

async function addReview(model) {
  try {
    await fetch(`${Constants.API_URL_MOVIE_REVIEW}/`, {
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

async function updateReview(model) {
  try {
    await fetch(`${Constants.API_URL_MOVIE_REVIEW}/id/${model.id}`, {
      method: "PUT",

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

async function deleteReview(id) {
  try {
    await fetch(`${Constants.API_URL_MOVIE_REVIEW}/id/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });

    return Promise.resolve();
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
