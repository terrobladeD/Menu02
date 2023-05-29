const express = require("express");
const cors = require("cors");
const path = require('path');
const http = require('http');
const websocket = require('./app/others/websocket');
const app = express();

// only allow specific ports to query the server
var corsOptions = {
  origin: ["http://localhost:8081", "http://localhost:8082","http://13.211.128.59/"]
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Menu project" });
});

//for general http request here seperate public and private requests
app.use('/api', require('./app/routes/public.router'));
app.use('/papi', require('./app/routes/private.router'));
require("./app/routes/JWT.router").configureRoutes(app);

// method to handle the image query from api
const imageUpload = require('./app/routes/imageUpload.router.js');
const imagesPath = path.join(__dirname, 'images');
app.use('/images', express.static(imagesPath));
app.use('/images', imageUpload);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// Create an HTTP server with the Express app
const server = http.createServer(app);

// Set up the WebSocket server using the HTTP server
websocket.setupWebSocketServer(server);

// //email sender
// const emailRoutes = require('./app/routes/emailRoutes');
// app.use('/', emailRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
