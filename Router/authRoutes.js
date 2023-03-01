const { Router } = require("express");
const handlers = require("../lib/handlers");
const router = Router();

router.get("/", (req, res) => {
  res.send("Home");
});
router.get("/api/signup", handlers.signup_get);
router.get("/api/login", handlers.login_get);
router.post("/api/signup", handlers.signup_post);
router.post("/api/login", handlers.login_post);

module.exports = router;
