const { Router } = require("express");
const handlers = require("../lib/handlers");
const router = Router();

router.get("/api/movies", handlers.movies); //Gets popular movies list from the tmdb api
router.post("/api/add-movie/:id", handlers.addMovie)

module.exports = router;
