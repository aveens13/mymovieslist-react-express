const tmdb = require("./tmdbRequest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.movies = (req, res) => {
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

exports.login_get = (req, res) => {
  res.send("Login Get");
};

exports.login_post = (req, res) => {
  res.send("Login Post");
};

exports.signup_get = (req, res) => {
  res.send("Signup Get");
};

exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("User not created");
  }
};
