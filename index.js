//Loading Modules and Libraries
const express = require("express");
const authenticationRoutes = require("./Router/authRoutes");
const moviesRoutes = require("./Router/movieRoutes");
const bodyParser = require("body-parser");
const fs = require("fs");
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
const logDir = path.join(__dirname, "loggerips");

//Store unique ips in a set
let uniqueIPs = new Set();
//Processing Request Logger
app.use((req, res, next) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress;
  if (!uniqueIPs.has(ip)) {
    uniqueIPs.add(ip);
  }
  console.log(`Processing request for ${req.url}...`);
  next();
});

// Schedule logging every 24 hours (86400000 ms)
setInterval(saveIPsToFile, 24 * 60 * 60 * 1000);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cors());
app.use("/api/signup", middleware.hashPassword);

//Routes
app.use(moviesRoutes);
app.use(authenticationRoutes);

WebsocketConnection(websocket);
//Listening to the server
server.listen(PORT, (req, res) => {
  console.log(`Server Started on http://localhost:${PORT}`);
});

// Function to write IPs to a log file every 24 hours
function saveIPsToFile() {
  if (uniqueIPs.size === 0) return;

  const filePath = path.join(logDir, "visitor_logs.txt");
  const timestamp = new Date().toISOString();
  const logData = `=== Log Date: ${timestamp} ===\n${[...uniqueIPs].join(
    "\n"
  )}\n\n`;

  fs.appendFile(filePath, logData, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      uniqueIPs.clear();
    }
  });
}
