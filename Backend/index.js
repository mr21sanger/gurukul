const express = require("express");
const http = require("http");
const cors = require("cors");
const userRoutes = require("./src/Router/user");
const complaintRoutes = require("./src/Router/complaint")
const { initializeSocket } = require("./src/Router/adminRoute"); // Import socket file
require("./src/Config/DBConfig");
const path = require("path")
const app = express();
const server = http.createServer(app); // Create HTTP server
const dotenv = require("dotenv");
dotenv.config();

const _dirName = path.resolve()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/user", userRoutes);
app.use("/user/complaint", complaintRoutes);

app.use(express.static(path.join(_dirName, "/Frontend/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirName, "Frontend", "dist", "index.html"));
})

// Initialize WebSocket
initializeSocket(server);

// Start Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
