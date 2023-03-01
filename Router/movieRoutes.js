const { Router } = require("express");
const handlers = require("../lib/handlers");
const router = Router();

router.get("/api/movies", handlers.movies);

module.exports = router;
