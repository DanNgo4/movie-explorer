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
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=d83946a92b810bbfb1605d3282f61181`;

  try {
    const response = await fetch(url);
    const movie = await response.json();

    return movie;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export {
  list,
  retrieve,
};
