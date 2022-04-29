const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const user = require('./user.js');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('src/bundle'));

var users = [];

io.on('connection', (socket) => {
  // Generate a random 4-digit userId
  var userId = Math.floor(Math.random() * 10000);
  while (users.indexOf(userId) > -1) {
    userId = Math.floor(Math.random() * 10000);
  }
  users.push(userId);

  // Instantiate a user at a random position
  var userPosition = {
    x: Math.floor(Math.random() * 1000),
    y: Math.floor(Math.random() * 1000)
  };
  userPositions[userId] = userPosition;

  console.log('User connected: ' + userId);
  console.log('Initial position: ' + userPosition.x + ', ' + userPosition.y);


  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('user disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});