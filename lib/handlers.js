const tmdb = require("./tmdbRequest");
exports.home = (req, res) => {
  res.send("Hello World");
};

exports.movies = (req, res) => {
  // axios
  //   .get(
  //     `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
  //   )
  //   .then((response) => {
  //     res.status(200).json({
  //       success: true,
  //       result: response.data.results,
  //     });
  //   });
  const fetchMovies = async () => {
    const { data } = await tmdb.tmdbRequest.get("/movie/popular");
    res.status(200).json({
      success: true,
      result: data.results,
    });
  };
  fetchMovies();
  // res.send("Hello Movies");
};
