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
import Player from './player.js';
import { Constants } from './constants.js';
import Controller from './controller.js';


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.use(express.static('src/bundle'));

var userIds = [];
var controllers = {};
var users = {};

io.on('connection', (socket) => {

  console.log('User connected, checking device...');

  socket.emit('device_check_handshake_start');

  socket.on('device_check_handshake_end', (data) => {
    if (data.device === 'mobile') {
      // Perform mobile controls setup
      console.log('Mobile device connected');
      socket.emit('show_mobile_controls');
    } else {
      // Perform desktop player setup
      // Generate a random 4-digit userId
      var userId = Math.floor(Math.random() * 10000);
      while (userIds.indexOf(userId) > -1) {
        userId = Math.floor(Math.random() * 10000);
      }
      userIds.push(userId);

      // Instantiate a user at a random position
      var player = new Player(
        userId, 
        Math.random() * 1000, 
        Math.random() * 1000
      );
      users[socket.id] = player;

      socket.emit('show_canvas', users);

      // Send the user list to client
      socket.emit('user_list', users);

      // Send the user list to all clients
      socket.broadcast.emit('user_list', users);

      console.log('Desktop user connected: ' + player.id);
    }
  });

  socket.on('player_key_down', (key) => {
    var user = users[socket.id];
    user.keyDown(key);
  });

  socket.on('player_key_up', (key) => {
    var user = users[socket.id];
    user.keyUp(key);
  }); 

  socket.on('code_submit', (code) => {
    console.log('Code  ' + code + '  submitted by client ' + socket.id);
    // Check if the code is a valid code
    for (var i = 0; i < userIds.length; i++) {
      var userId = userIds[i];
      if (code === userId) {
        // Code is valid, check if code is being controlled by another client
        for (var i = 0; i < Object(controllers).values.length; i++) {
          var controller = Object(controllers).values[i];
          if (controller.code === code) {
            console.log('Code already in use');
            socket.emit('code_in_use');
            return;
          }
        }
        // Code is valid and not being used, add the controller
        var controller = new Controller(code, socket.id);
        controllers[socket.id] = controller;
        console.log('Controller added');
        socket.emit('code_accepted');
        return;
      }
    }
    // Code is invalid
    socket.emit('code_invalid');
  });

  socket.on('disconnect', () => {
    // Remove the user from the user list
    if (users[socket.id]) {
      var user = users[socket.id];
      delete users[socket.id];
      
      socket.broadcast.emit('user_list', users);
      console.log('Desktop disconnected: ' + user.id);
    } else {
      console.log('Mobile device disconnected');
    }
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