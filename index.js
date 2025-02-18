//Loading Modules and Libraries
const express = require("express");
const authenticationRoutes = require("./Router/authRoutes");
const moviesRoutes = require("./Router/movieRoutes");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5055;
const middleware = require("./lib/middleware");
const Websocket = require("ws");
const http = require("http");
//Setting up express application and prisma client
const app = express();
const server = http.createServer(app);
const websocket = new Websocket.Server({ server, path: "/ws" });
const path = require("path");
const { WebsocketConnection } = require("./lib/ws");

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

WebsocketConnection(websocket);
//Listening to the server
server.listen(PORT, (req, res) => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
