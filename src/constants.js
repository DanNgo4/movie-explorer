export class Constants {
  // cache
  static LOCAL_STORAGE_MOVIES        = "cache-movies";
  static LOCAL_STORAGE_CURRENT_MOVIE = "cache-current-movie";
  static LOCAL_STORAGE_CURRENT_USER  = "cache-current-user";

  // API
  static TMDB_API_KEY           = "d83946a92b810bbfb1605d3282f61181";
  static API_URL_MOVIE_LIST     = `https://api.themoviedb.org/3/discover/movie?api_key=${Constants.TMDB_API_KEY}&include_adult=false&with_genres=16`;
  static API_URL_MOVIE          = "https://api.themoviedb.org/3/movie";
  static API_URL_MOVIE_POSTER   = "https://image.tmdb.org/t/p/original";
  static API_URL_MOVIE_POSTER2  = "https://image.tmdb.org/t/p/w500";
  static API_URL_MOVIE_REVIEW   = `${import.meta.env.BASE_URL}/apis_movie_review.php`;
  static API_URL_USER           = `${import.meta.env.BASE_URL}/apis_user.php`;
  static API_URL_MOVIE_IMAGE1   = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  static API_URL_MOVIE_IMAGE2   = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  static API_URL_MOUNTAIN_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
  static API_URL_OCEAN_IMAGE    = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
  static API_URL_NEWS           = `${import.meta.env.BASE_URL}/news.json`;

  // Genre Map
  static GENRE_MAP = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics"
  };
};

Object.freeze(Constants);
