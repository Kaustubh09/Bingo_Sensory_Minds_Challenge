// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: [
      "https://space-bingo-frontend.onrender.com", // Your frontend URL
      "http://localhost:3000" // For local testing
    ],
    methods: ["GET", "POST"]
  }
});

// Track game state (25 cells, center is always marked)
let gameState = Array(25).fill(false);
gameState[12] = true; // Free space

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("New player connected:", socket.id);

  // Send current game state to new player
  socket.emit("game_state", gameState);

  // Handle cell toggle events
  socket.on("toggle_cell", (index) => {
    if (index !== 12) { // Prevent toggling the free space
      gameState[index] = !gameState[index];
      io.emit("game_state", gameState); // Broadcast to all players
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});