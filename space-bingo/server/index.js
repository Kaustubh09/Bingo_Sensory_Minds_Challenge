const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://space-bingo-frontend.onrender.com",
    methods: ["GET", "POST"]
  }
});

let gameState = Array(25).fill(false);
gameState[12] = true; // Middle cell is always active

io.on('connection', (socket) => {
  socket.emit('game_state', gameState);
  
  socket.on('toggle_cell', (index) => {
    if (index === 12) return;
    gameState[index] = !gameState[index];
    io.emit('game_state', gameState);
  });
});

const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
