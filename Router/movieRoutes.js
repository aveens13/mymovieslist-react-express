const { Router } = require("express");
const { requireAuth } = require("../lib/jwt");
const handlers = require("../lib/handlers");
const broadcast = require("../lib/broadcastingLogic");
const router = Router();
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 },
});

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        result: "File size too large. Max 2MB allowed.",
      });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

router.get("/api/movies", requireAuth, handlers.movies); //Gets popular movies list from the tmdb api
router.get("/api/details/:movieId", requireAuth, handlers.getDetails);
router.get("/api/movies/homepage", handlers.topratedmovies);
router.get("/api/tv/seasons", requireAuth, handlers.getSeasonDetails);
router.get("/api/video/:movieId", requireAuth, handlers.getVideoUsingId);
router.get("/api/tv-shows", requireAuth, handlers.tv); //Gets popular tv shows list from the tmdb api
router.get("/api/get-movie-list/:userId", requireAuth, handlers.getMovieList); //Movies list for specific user
router.get(
  "/api/get-recommendations/:userId",
  requireAuth,
  handlers.getRecommendations
); //Movies list for specific user
router.get("/api/get-show-list/:userId", requireAuth, handlers.getShowsList); //Movies list for specific user
router.post("/api/add-movie/:movieId/:userId", requireAuth, handlers.addMovie);
router.post(
  "/api/update-movie/:movieId/:userId",
  requireAuth,
  handlers.updateMovie
);
router.post("/api/followuser", requireAuth, handlers.followPost);
router.post("/api/hasfollowrelation", requireAuth, handlers.hasFollowRelation);
router.post("/api/sharemovie", requireAuth, handlers.shareMovie);
router.post(
  "/api/deletefromlist/:movieId/:userId",
  requireAuth,
  handlers.deleteList
);
router.post("/api/search", requireAuth, handlers.searchMovie);
router.post("/api/upload/:userId", requireAuth, handlers.uploadpicture);
router.post(
  "/api/updateinfo/:userId",
  requireAuth,
  upload.single("profilepic"),
  multerErrorHandler,
  handlers.updateUserInfo
);
router.get(
  "/api/recommededfollowers/:userId",
  requireAuth,
  handlers.recommendFollowers
);

router.get("/api/feed/:userId", requireAuth, handlers.getFeed);
router.get("/api/userinfo/:userId", requireAuth, handlers.userInfo);
router.get("/api/posts/:userId", requireAuth, handlers.getUserPosts);
router.delete("/api/post/:postId", requireAuth, handlers.deletePost);

//Streaming and broadcasting as well as consuming endpoints
router.post("/api/broadcast", requireAuth, broadcast.broadcast);
router.post("/api/endBroadcast", requireAuth, broadcast.endBroadcast);
router.post("/api/consume", requireAuth, broadcast.consume);
router.get("/api/activeStreams", requireAuth, broadcast.getActiveStreams);
module.exports = router;
