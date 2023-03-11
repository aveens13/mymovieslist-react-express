const { Router } = require("express");
const handlers = require("../lib/handlers");
const router = Router();

router.get("/api/movies", handlers.movies); //Gets popular movies list from the tmdb api
router.get("/api/tv-shows", handlers.tv); //Gets popular tv shows list from the tmdb api
router.get("/api/get-movie-list", handlers.getMovieList); //Movies list for specific user
router.post("/api/add-movie/:id", handlers.addMovie)

module.exports = router;
