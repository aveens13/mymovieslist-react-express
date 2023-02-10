//Loading Modules and Libraries
const express = require("express");
const handlers = require("./lib/handlers");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { credentials } = require("./Configurations/config");
const { appendFile } = require("fs");
const PORT = process.env.PORT || 5055;

//Setting up express application
const app = express();

//Processing Request Logger
app.use((req, res, next) => {
  console.log(`Processing request for ${req.url}...`);
  next();
});
app.use(
  cors({
    origin: "*",
  })
);

//Routes
app.get("/", handlers.home);
app.get("/api/movies", handlers.movies);

//Listening to the server
app.listen(PORT, (req, res) => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
