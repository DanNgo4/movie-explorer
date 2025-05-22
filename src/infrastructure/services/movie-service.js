async function list() {
  const url = "https://api.themoviedb.org/3/discover/movie?api_key=d83946a92b810bbfb1605d3282f61181&page=1";

  try {
    const response = await fetch(url);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export {
  list
};
