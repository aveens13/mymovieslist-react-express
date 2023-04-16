const { Router } = require("express");
const { requireAuth } = require("../lib/jwt");
const handlers = require("../lib/handlers");
const router = Router();

router.get("/api/movies", requireAuth, handlers.movies); //Gets popular movies list from the tmdb api
router.get("/api/tv-shows", requireAuth, handlers.tv); //Gets popular tv shows list from the tmdb api
router.get("/api/get-movie-list/:userId", requireAuth, handlers.getMovieList); //Movies list for specific user
router.post("/api/add-movie/:movieId/:userId", requireAuth, handlers.addMovie);
router.post("/api/search", requireAuth, handlers.searchMovie);

module.exports = router;
