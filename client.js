const socket = io("http://localhost:3000");

const players = {}; // Track all players in the game

// Handle current players data
socket.on("currentPlayers", (serverPlayers) => {
  for (const id in serverPlayers) {
    if (id !== socket.id) {
      addPlayerToGame(id, serverPlayers[id]);
    }
  }
});

// Handle new player joining
socket.on("newPlayer", (player) => {
  addPlayerToGame(player.id, player);
});

// Handle player movement updates
socket.on("updatePlayer", (player) => {
  if (players[player.id]) {
    players[player.id].x = player.x;
    players[player.id].y = player.y;
    players[player.id].z = player.z;
    updatePlayerPosition(player.id);
  }
});

// Handle player disconnection
socket.on("removePlayer", (id) => {
  if (players[id]) {
    removePlayerFromGame(id);
  }
});

// Chat: Handle incoming messages
socket.on("chatMessage", (chatData) => {
  const chatBox = document.getElementById("chatBox");
  const message = document.createElement("div");
  message.textContent = `${chatData.playerName}: ${chatData.message}`;
  chatBox.appendChild(message);
});

// Function to add a player to the game
function addPlayerToGame(id, data) {
  players[id] = data;
  console.log(`Player ${id} added to the game`);
}

// Function to update a player's position
function updatePlayerPosition(id) {
  console.log(`Updating player ${id} position to`, players[id]);
}

// Function to remove a player from the game
function removePlayerFromGame(id) {
  console.log(`Player ${id} removed from the game`);
  delete players[id];
}

// Function to send player movement to the server
function sendMovement(x, y, z) {
  socket.emit("playerMove", { x, y, z });
}

// Chat: Send message to the server
function sendMessage() {
  const chatInput = document.getElementById("chatInput");
  const message = chatInput.value.trim();
  if (message) {
    socket.emit("chatMessage", message);
    chatInput.value = ""; // Clear the input field
  }
}