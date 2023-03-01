//Loading Modules and Libraries
const express = require("express");
const authenticationRoutes = require("./Router/authRoutes");
const moviesRoutes = require("./Router/movieRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5055;

//Setting up express application and prisma client
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
app.use(express.json());

//Routes
app.use(moviesRoutes);
app.use(authenticationRoutes);

//Listening to the server
app.listen(PORT, (req, res) => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
