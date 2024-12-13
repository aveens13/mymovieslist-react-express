const { Router } = require("express");
const handlers = require("../lib/authenticationLogic");
const { hashPassword } = require("../lib/middleware");
const router = Router();

router.get("/api/verifyToken", handlers.checktoken);
router.post("/api/signup", handlers.signup_post);
router.post("/api/login", handlers.login_post);
router.post("/api/validateOTP", hashPassword, handlers.validateOTP);
router.get("/api/logout", handlers.logout);

module.exports = router;
