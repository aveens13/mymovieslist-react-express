const tmdb = require("./tmdbRequest");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const { createToken } = require("./jwt");
const bcrypt = require("bcrypt");
const maxAge = 3 * 24 * 60 * 60; //Maximum age for the token to be valid
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const url = require("url");
dotenv.config();

//checks for token
exports.checktoken = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(400).send({
          status: false,
          error: "Session has expired",
        });
      } else {
        res.status(200).send({
          success: true,
          data: decodedToken,
        });
      }
    });
  } else {
    res.status(400).send({
      status: false,
      error: "Need to Login to access",
    });
  }
};

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

exports.tv = (req, res) => {
  const fetchMovies = async () => {
    const { data } = await tmdb.tmdbRequest.get("/tv/popular");
    res.status(200).json({
      success: true,
      result: data.results,
    });
  };
  fetchMovies();
  // res.send("Hello Movies");
};

exports.searchMovie = async (req, res) => {
  let { query } = url.parse(req.url, true);
  // console.log(query.name);
  const { data } = await tmdb.tmdbRequest.get(
    `/search/multi?query=${query.name}&include_adult=false`
  );
  res.status(200).json({
    success: true,
    result: data.results,
  });
};

//Fires up whenever user tries to add some movie to his list
exports.addMovie = async (req, res) => {
  let { query } = url.parse(req.url, true);
  const id = {
    movie: req.params.movieId,
    user: req.params.userId,
  };

  //For providing name of the added movie/tv
  const info = await tmdb.tmdbRequest.get(`/${query.type}/${id.movie}`);
  let resultText;
  query.type == "tv"
    ? (resultText = info.data.name)
    : (resultText = info.data.title);

  try {
    if (query.type == "movie") {
      await prisma.movie.create({
        data: {
          movie_id: Number(id.movie),
          authorId: id.user,
        },
      });
    } else if (query.type == "tv") {
      await prisma.show.create({
        data: {
          show_id: Number(id.movie),
          authorId: id.user,
        },
      });
    }

    res.status(200).send({
      status: true,
      result: `Added ${resultText} to the list.`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        res.status(401).send({
          status: false,
          result: `${resultText} is already on your list.`,
        });
      }
    }
  }
};

//Gets user's movie list
exports.getMovieList = async (req, res) => {
  const userId = req.params.userId;
  try {
    const movieList = await prisma.movie.findMany({
      where: {
        authorId: userId,
      },
    });
    const list = await Promise.all(
      movieList.map(async (movie) => {
        const data = await tmdb.tmdbRequest.get(
          `/movie/${movie.movie_id}&language=en-US`
        );
        return data.data;
      })
    );

    return res.status(200).json({
      success: true,
      result: list,
      database: movieList,
    });
  } catch (error) {
    res.status(401).send("Error, Cannot fetch movies list for the user");
  }
};

exports.getShowsList = async (req, res) => {
  const userId = req.params.userId;
  try {
    const movieList = await prisma.show.findMany({
      where: {
        authorId: userId,
      },
    });
    const list = await Promise.all(
      movieList.map(async (movie) => {
        const data = await tmdb.tmdbRequest.get(
          `/tv/${movie.show_id}&language=en-US`
        );
        return data.data;
      })
    );

    return res.status(200).json({
      success: true,
      result: list,
      database: movieList,
    });
  } catch (error) {
    res.status(401).send("Error, Cannot fetch movies list for the user");
  }
};

//Get Movie Info by id
exports.getDetails = async (req, res) => {
  let { query } = url.parse(req.url, true);
  const movieId = req.params.movieId;
  const info = await tmdb.tmdbRequest.get(`/${query.type}/${movieId}`);

  if (query.type == "person") {
    return res.status(200).json({
      info: info.data,
    });
  }
  const credits = await tmdb.tmdbRequest.get(
    `/${query.type}/${movieId}/credits`
  );
  return res.status(200).json({
    info: info.data,
    credits: credits.data,
  });
};
//User authentication part
//Logs the user in
exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = createToken(user.user_id, maxAge);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).send(user);
      } else {
        res.status(401).send({
          status: "passworderror",
          error: "Incorrect Password",
        });
      }
    } else {
      res.status(400).send({
        status: "emailerror",
        error: "Please Check your email and try again.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Email does not exist");
  }
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
    const token = createToken(user.user_id, maxAge);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user.user_id });
  } catch (error) {
    console.log(error);
    res.status(400).send("User not created");
  }
};
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).send({
    success: true,
  });
};
