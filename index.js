//Loading Modules and Libraries
const express = require("express");
const authenticationRoutes = require("./Router/authRoutes");
const moviesRoutes = require("./Router/movieRoutes");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5055;
const middleware = require("./lib/middleware");
//Setting up express application and prisma client
const app = express();
const path = require("path");
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
app.use(cookieparser());
app.use("/api/signup", middleware.hashPassword);

//Routes
app.use(moviesRoutes);
app.use(authenticationRoutes);

//Production script

app.use(express.static("./client/dist"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});
//Listening to the server
app.listen(PORT, (req, res) => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
