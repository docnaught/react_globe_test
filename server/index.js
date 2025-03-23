const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store connected users and their selections
const users = {};
const selectedCountries = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Add user to the list
  users[socket.id] = {
    id: socket.id,
    name: `User-${Object.keys(users).length + 1}`
  };
  
  // Send current state to the new user
  socket.emit('init', { users, selectedCountries });
  
  // Broadcast new user to all other users
  socket.broadcast.emit('userJoined', users[socket.id]);
  
  // Handle user name change
  socket.on('updateUsername', (name) => {
    users[socket.id].name = name;
    io.emit('userUpdated', users[socket.id]);
  });
  
  // Handle country selection/highlighting
  socket.on('selectCountry', (country) => {
    selectedCountries[socket.id] = country;
    io.emit('countrySelected', { userId: socket.id, country, userName: users[socket.id].name });
  });
  
  // Handle camera position update
  socket.on('updateCamera', (cameraPosition) => {
    // Only broadcast to others to avoid circular updates
    socket.broadcast.emit('cameraUpdated', { 
      userId: socket.id,
      userName: users[socket.id].name,
      position: cameraPosition 
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Clean up user data
    delete users[socket.id];
    delete selectedCountries[socket.id];
    // Notify others
    io.emit('userLeft', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
