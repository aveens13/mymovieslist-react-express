const tmdb = require("./tmdbRequest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//Api that loads popular movies from TMDB API
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

//Fires up whenever user tries to add some movie to his list
exports.addMovie = async (req,res) =>{
  const movie_id = req.params.id;
  try {
    const movie = await prisma.movie.create({
      data:{
        movie_id: Number(movie_id),
        authorId: '26e7d81f-88d6-4bd7-9431-ec03026fade6',
      }
    })
    res.status(200).send(movie);
  } catch (error) {
    console.log(error);
    res.status(401).send("Error, Movie not created")
  }
}

//User authenticatio part
//Logs the user in
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
