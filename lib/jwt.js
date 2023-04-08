const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//Creates a token for the user
exports.createToken = (id, maxAge) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  //Check json web token exists and is verified
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(400).send({
          status: false,
          error: "Session has expired",
        });
      } else {
        next();
      }
    });
  } else {
    res.status(400).send({
      status: false,
      error: "Need to Login to access",
    });
  }
};
