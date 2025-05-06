const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const players = {}; // Store player data

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // Add a new player to the game
  players[socket.id] = {
    x: 0, // Initial x position
    y: 0, // Initial y position
    z: 0  // Initial z position
  };

  // Send the current players to the new player
  socket.emit("currentPlayers", players);

  // Notify other players of the new player
  socket.broadcast.emit("newPlayer", { id: socket.id, ...players[socket.id] });

  // Handle player movement
  socket.on("playerMove", (data) => {
    if (players[socket.id]) {
      players[socket.id] = data; // Update player position
      socket.broadcast.emit("updatePlayer", { id: socket.id, ...data });
    }
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("A player disconnected:", socket.id);
    delete players[socket.id];
    io.emit("removePlayer", socket.id);
  });

  // Handle chat messages
  socket.on("chatMessage", (message) => {
    const playerName = `Player ${socket.id.substring(0, 4)}`; // Optional: Shorten ID for display
    const chatData = { playerName, message };
    console.log("Chat message received:", chatData);
    io.emit("chatMessage", chatData); // Broadcast chat to all players
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});