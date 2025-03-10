//imports
const tmdb = require("./tmdbRequest");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const randomstring = require("randomstring");
const dotenv = require("dotenv");
const redis = require("redis");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
const url = require("url");
dotenv.config();

//Setting up reddis client for caching the api requests from tmdb
let redisClient;
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Redis Connetion ${error}`));

  await redisClient.connect();
})();

//Updates movie
exports.updateMovie = async (req, res) => {
  let { query } = url.parse(req.url, true);
  const id = {
    movie: req.params.movieId,
    user: req.params.userId,
  };
  console.log(req.body);
  try {
    let result;
    if (query.type == "movie") {
      result = await prisma.movie.update({
        where: {
          movie_id_authorId: {
            movie_id: Number(id.movie),
            authorId: id.user,
          },
        },
        data: req.body,
      });
    } else {
      result = await prisma.show.update({
        where: {
          show_id_authorId: {
            show_id: Number(id.movie),
            authorId: id.user,
          },
        },
        data: req.body,
      });
    }
    return res.status(200).json({
      success: true,
      result: result,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(401).send({
          status: false,
          result: `This movie is not on your list.`,
          code: error.code,
          cause: error.meta.cause,
        });
      }
    }
    return res.status(400).json({
      success: false,
      message: "Cannot Update the movie/show",
    });
  }
};

//Api that loads popular movies from TMDB API
exports.movies = (req, res) => {
  const fetchMovies = async () => {
    let results;
    let popularMovies = "myCachedKey";
    let isCached = false;
    const cachedResults = await redisClient.get(popularMovies);
    if (cachedResults) {
      isCached = true;
      results = JSON.parse(cachedResults);
    } else {
      const { data } = await tmdb.tmdbRequest.get("/movie/popular");
      results = { popular: data.results };
      await redisClient.set(popularMovies, JSON.stringify(results), {
        EX: 7200,
        NX: true,
      });
    }
    res.status(200).json({
      fromCache: isCached,
      success: true,
      result: results,
    });
  };
  fetchMovies();
  // res.send("Hello Movies");
};

exports.topratedmovies = (req, res) => {
  const fetchMovies = async () => {
    let results;
    let popularMovies = "homepageKey";
    let isCached = false;
    const cachedResults = await redisClient.get(popularMovies);
    if (cachedResults) {
      isCached = true;
      results = JSON.parse(cachedResults);
    } else {
      const { data } = await tmdb.tmdbRequest.get("/movie/top_rated");

      data.results = await Promise.all(
        data.results.map(async (movie) => {
          const info = await tmdb.tmdbRequest.get(`/movie/${movie.id}/credits`);
          return { ...movie, cast: info.data.cast }; // Append cast details to each movie
        })
      );
      results = { popular: data.results };
      await redisClient.set(popularMovies, JSON.stringify(results), {
        EX: 7200,
        NX: true,
      });
    }
    res.status(200).json({
      fromCache: isCached,
      success: true,
      result: results,
    });
  };
  fetchMovies();
  // res.send("Hello Movies");
};

//Recommend followers
async function getRecommendations(userfollowings) {
  try {
    const userFollowerFollows = await Promise.all(
      userfollowings.map((followee) => get_followings(followee))
    );
    return userFollowerFollows;
  } catch (error) {
    console.error("Error fetching followings:", error);
    return [];
  }
}

exports.recommendFollowers = async (req, res) => {
  //Needs to be updated
  const userId = req.params.userId;
  const userfollowings = await get_followings(userId);
  let potentialFollwings = await getRecommendations(userfollowings);
  potentialFollwings = [].concat(...potentialFollwings); //nested lists to a single list

  const updatedPotentialFollowings = potentialFollwings.filter(
    (value, index, self) => self.indexOf(value) == index
  ); //removes duplicates

  let recommendFollowers = updatedPotentialFollowings.map(async (following) => {
    const user = await prisma.user.findUnique({
      where: {
        user_id: following,
      },
      select: {
        user_id: true,
        name: true,
      },
    });
    return user;
  });

  recommendFollowers = await Promise.all(recommendFollowers);

  const updatedFollowersPromises = recommendFollowers.map(async (user) => {
    const followerInfo = await get_followers(user.user_id);
    return {
      ...user,
      alreadyFollowed: userfollowings.includes(user.user_id) ? true : false,
      followerInfo: followerInfo.map((f) => f.user),
      count: followerInfo.length,
    };
  });

  const updatedFollowers = await Promise.all(updatedFollowersPromises);

  res.status(200).json({
    success: true,
    result: updatedFollowers,
  });
};
//Get recommendations
exports.getRecommendations = async (req, res) => {
  const userId = req.params.userId;
  const movieList = await prisma.movie.findMany({
    where: {
      authorId: userId,
    },
  });

  const recommendation = await Promise.all(
    movieList.map(async (movie) => {
      const { data } = await tmdb.tmdbrecommender.get(
        `/recommendation/${movie.movie_id}`
      );
      return data;
    })
  );

  let list_of_recommendations = await Promise.all(
    recommendation.map(async (recommendationOfSingleMovie) => {
      const data = await Promise.all(
        recommendationOfSingleMovie.map(async (movie) => {
          try {
            const { data } = await tmdb.tmdbRequest.get(
              `/movie/${movie.id}&language=en-US`
            );
            return data;
          } catch (error) {
            console.error(
              `Cannot Fetch details for ${error.response.config.url}`
            );
          }
        })
      );
      return data;
    })
  );

  list_of_recommendations = list_of_recommendations.flatMap(
    (movieList) => movieList
  );

  // Filter out duplicates based on the movie ID
  const seenIds = new Set();
  list_of_recommendations = list_of_recommendations.filter((movie) => {
    if (seenIds.has(movie.id)) {
      return false;
    } else {
      seenIds.add(movie.id);
      return true;
    }
  });

  res.status(200).json({
    success: true,
    result: list_of_recommendations,
  });
};

exports.tv = (req, res) => {
  const fetchMovies = async () => {
    let results;
    let popularTv = "mySecondCachedkey";
    let isCached = false;
    const cachedResults = await redisClient.get(popularTv);
    if (cachedResults) {
      isCached = true;
      results = JSON.parse(cachedResults);
    } else {
      const { data } = await tmdb.tmdbRequest.get("/tv/popular");
      results = data.results;
      await redisClient.set(popularTv, JSON.stringify(results), {
        EX: 7200,
        NX: true,
      });
    }
    res.status(200).json({
      fromCache: isCached,
      success: true,
      result: results,
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
    } else {
      res.status(401).send({
        status: false,
        result: "Internal Server Timeout Error",
      });
    }
  }
};

//Fires up whenever user is trying to delete a movie or tv from his list
exports.deleteList = async (req, res) => {
  let { query } = url.parse(req.url, true);
  const id = {
    movie: req.params.movieId,
    user: req.params.userId,
  };

  try {
    if (query.type == "movie") {
      await prisma.movie.deleteMany({
        where: {
          movie_id: Number(id.movie),
          authorId: id.user,
        },
      });
    } else if (query.type == "tv") {
      await prisma.show.deleteMany({
        where: {
          show_id: Number(id.movie),
          authorId: id.user,
        },
      });
    }
    return res.status(200).send({
      status: true,
      result: `Deleted from the list.`,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: false,
      result: `Cannot delete from your list`,
    });
  }
};

//Gets user's movie list
exports.getMovieList = async (req, res) => {
  const userId = req.params.userId;
  try {
    let results;
    //Checking if the database is updated
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
    results = {
      success: true,
      result: list,
      database: movieList,
    };

    return res.status(200).json({ data: results });
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

exports.getSeasonDetails = async (req, res) => {
  try {
    let { query } = url.parse(req.url, true);

    const info = await tmdb.tmdbRequest.get(
      `/tv/${query.seriesId}/season/${query.seasonNumber}`
    );
    return res.status(200).json({
      success: true,
      result: info.data,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      success: false,
      result: error.message,
    });
  }
};

exports.getVideoUsingId = async (req, res) => {
  let { query } = url.parse(req.url, true);
  const movieId = req.params.movieId;

  if (query.type == "person") {
    return res.status(200).json({
      success: false,
      info: "Person Data has no videos associated",
    });
  }

  const info = await tmdb.tmdbRequest.get(
    `/${query.type}/${movieId}/videos?language=en-US`
  );

  const officialTrailer = info.data.results.find((trailer) => trailer.official);

  if (officialTrailer) {
    return res.status(200).json({
      info: officialTrailer,
    });
  }
};

exports.followPost = async (req, res) => {
  const { userID, targetUserID } = req.body;
  try {
    const followingList = await get_followings(userID);

    if (followingList.includes(targetUserID)) {
      console.log("Already");
      throw new Error("Already follows this user");
    }
    //If not already followed
    await prisma.follows.create({
      data: {
        userID,
        targetUserID,
      },
    });

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Cannot follow the user");
  }
};

exports.shareMovie = async (req, res) => {
  const { authorId, text, movieID } = req.body;
  try {
    await prisma.posts.create({
      data: {
        contentID: movieID,
        description: text,
        authorID: authorId,
      },
    });

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Cannot create the post");
  }
};

exports.getFeed = async (req, res) => {
  const userId = req.params.userId;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  try {
    let results;
    let feedSection = `feedSection:${userId}`;
    let isCached = false;
    const cachedResults = await redisClient.get(feedSection);
    if (cachedResults) {
      isCached = true;
      results = JSON.parse(cachedResults);
    } else {
      const posts = await prisma.posts.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const updatedPostsPromise = posts.map(async (post) => {
        const user = await prisma.user.findUnique({
          where: {
            user_id: post.authorID,
          },
          select: {
            name: true,
            imageURL: true,
          },
        });

        const movie = await tmdb.tmdbRequest.get(`/movie/${post.contentID}`);
        return {
          ...post,
          author: user,
          content: movie.data,
        };
      });

      const updatedPosts = await Promise.all(updatedPostsPromise);
      results = { posts: updatedPosts };

      await redisClient.set(feedSection, JSON.stringify(results), {
        EX: 100,
        NX: true,
      });
    }

    return res.status(200).json({
      success: true,
      result: results.posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Cannot update the feed");
  }
};

exports.getUserPosts = async (req, res) => {
  const userId = req.params.userId;
  let results;
  try {
    const posts = await prisma.posts.findMany({
      where: {
        authorID: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const updatedPostsPromise = posts.map(async (post) => {
      const movie = await tmdb.tmdbRequest.get(`/movie/${post.contentID}`);
      return {
        ...post,
        content: movie.data,
      };
    });

    const updatedPosts = await Promise.all(updatedPostsPromise);
    results = { posts: updatedPosts };
    return res.status(200).json({
      success: true,
      result: results.posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error fetching user posts.");
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.postId;
  try {
    await prisma.posts.delete({
      where: {
        postID: postId,
      },
    });
    return res.status(200).json({
      success: true,
      result: "The post was deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      result: "Error while deleting the post.",
    });
  }
};

exports.userInfo = async (req, res) => {
  const userId = req.params.userId;
  try {
    const details = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        name: true,
        follows: true,
        followedBy: true,
        username: true,
        bio: true,
        imageURL: true,
      },
    });

    return res.status(200).json({
      success: true,
      result: details,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      result: "Error fetching user information.",
    });
  }
};

const get_followers = async (userId) => {
  const followers = await prisma.follows.findMany({
    where: {
      targetUserID: userId,
    },
    include: {
      user: true,
    },
  });
  return followers;
};

exports.uploadpicture = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      result: "imageURL",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(400).json({
      success: false,
      result: "Error uploading picture",
      message: error.message,
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  const paramUserId = req.params.userId;
  const updatedInfo = req.body;
  let updateUser;
  try {
    if (req.file) {
      const filePath = req.file.path;
      const fileExtension = req.file.mimetype.split("/")[1];
      const blobName = `profile_pics/${paramUserId}.${fileExtension}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadFile(filePath, {
        blobHTTPHeaders: {
          blobContentType: req.file.mimetype,
        },
      });
      const imageURL = blockBlobClient.url;

      fs.unlinkSync(filePath);

      updateUser = await prisma.user.update({
        where: {
          user_id: paramUserId,
        },
        data: {
          name: updatedInfo.name,
          username: updatedInfo.username,
          bio: updatedInfo.bio,
          imageURL: imageURL,
        },
      });
    } else {
      updateUser = await prisma.user.update({
        where: {
          user_id: paramUserId,
        },
        data: {
          name: updatedInfo.name,
          username: updatedInfo.username,
          bio: updatedInfo.bio,
        },
      });
    }

    return res.status(200).json({
      success: true,
      result: updateUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      result: "Error uploading picture",
      message: error.message,
    });
  }
};

const get_followings = async (user_id) => {
  try {
    followings = await prisma.follows.findMany({
      where: {
        userID: user_id,
      },
      select: {
        targetUserID: true,
      },
    });

    const followingIds = followings.map((following) => following.targetUserID);
    return followingIds;
  } catch (error) {
    console.log(error);
  }
};

// Generate OTP
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}
