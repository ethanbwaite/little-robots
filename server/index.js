import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const io = new Server(server);
import User from './user.js';
import { Constants } from './constants.js';


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.use(express.static('src/bundle'));

var userIds = [];
var users = {};

io.on('connection', (socket) => {
  // Generate a random 4-digit userId
  var userId = Math.floor(Math.random() * 10000);
  while (userIds.indexOf(userId) > -1) {
    userId = Math.floor(Math.random() * 10000);
  }
  userIds.push(userId);

  // Instantiate a user at a random position
  var user = new User(
    userId, 
    Math.random() * 1000, 
    Math.random() * 1000
  );
  users[socket.id] = user;

  // Send the user infornation to client
  socket.emit('user_info', user);

  // Send the user list to client
  socket.emit('user_list', users);

  // Send the user list to all clients
  socket.broadcast.emit('user_list', users);

  console.log('User connected: ' + user.id);


  socket.on('disconnect', () => {
    // Remove the user from the user list
    var user = users[socket.id];
    delete users[socket.id];
    
    socket.broadcast.emit('user_list', users);
    console.log('User disconnected: ' + user.id);
  });

  socket.on('key_down', (key) => {
    var user = users[socket.id];
    user.keyDown(key);
  });

  socket.on('key_up', (key) => {
    var user = users[socket.id];
    user.keyUp(key);
  });
});

setInterval(() => {
  Object.values(users).forEach((user) => {
    user.update();
  });
  io.emit('user_list', users)
}, Constants.SERVER.INTERVAL_RATE);

server.listen(3000, () => {
  console.log('listening on *:3000');
});