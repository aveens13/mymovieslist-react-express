const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
exports.tmdbRequest = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Accept: "application/json",
  },
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

exports.tmdbrecommender = axios.create({
  baseURL: process.env.RECOMMENDER_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});
