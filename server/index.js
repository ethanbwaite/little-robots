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

var controllers = {}; // Dict of active controllers
var users = {}; // Dict of active users (controllable players)
var userIdToPlayerSocket = {};
var userIdToControllerSocket = {};
var stats = {
  kittyCount: 0,
  maxKittyCount: 0
}
var messageCache = [];

io.on('connection', (socket) => {

  console.log('User connected, checking device...');

  socket.emit('device_check_handshake_start', socket.id);

  socket.on('device_check_handshake_end', (data) => {
    if (data.device === 'mobile') {
      // MOBILE
      // Perform mobile controls setup
      console.log('Mobile device connected');
      socket.emit('show_mobile_controls');
    } else {
      // DESKTOP
      // Perform desktop player setup
      // Generate a random 4-digit userId not less than 4 digits
      var userId = Math.floor(Math.random() * 9000) + 1000;
      while (userIdToPlayerSocket[userId]) {
        userId = Math.floor(Math.random() * 9000) + 1000;
      }

      // Instantiate a user at a random position
      var player = new Player(
        userId, 
        socket.id,
        Math.random() * Constants.CANVAS.WIDTH * 0.7 + Constants.CANVAS.WIDTH * 0.15,
        Math.random() * Constants.CANVAS.HEIGHT * 0.7 + Constants.CANVAS.HEIGHT * 0.15,
      );
      users[socket.id] = player;
      userIdToPlayerSocket[userId] = socket.id;

      socket.emit('show_canvas', users);

      // Send the user list to client
      socket.emit('user_list', users);

      // Send the user list to all clients
      socket.broadcast.emit('user_list', users);

      // Update stats
      stats.kittyCount++;
      var usersLength = Object.values(users).length
      if (usersLength > stats.maxKittyCount) {
        stats.maxKittyCount = usersLength;
      }
      socket.emit('stats', stats);
      socket.broadcast.emit('stats', stats);
      socket.emit('code', userId);
      socket.emit('chat_cache', messageCache);

      console.log('Desktop user connected: ' + player.id);
    }
  });

  // Local arrowkey controls (not intended for use)
  socket.on('player_key_down', (key) => {
    var user = users[socket.id];
    user.keyDown(key);
  });

  socket.on('player_key_up', (key) => {
    var user = users[socket.id];
    user.keyUp(key);
  }); 

  // Mobile controls
  socket.on('controller_key_down', (key) => {
    var controller = controllers[socket.id];
    if (controller) {
      var userId = controller.playerId;
      var playerSocket = userIdToPlayerSocket[userId];
      var user = users[playerSocket];
      if (user) {
        user.keyDown(key);
      } else {
        console.log('User not found');
        socket.emit('controller_lost_connection');
      }
    }
  });

  socket.on('controller_key_up', (key) => {
    var controller = controllers[socket.id];
    if (controller) {
      var userId = controller.playerId;
      var playerSocket = userIdToPlayerSocket[userId];
      var user = users[playerSocket];
      if (user) {
        user.keyUp(key);
      } else {
        console.log('User not found');
        socket.emit('controller_lost_connection');
      }
    }
  });

  socket.on('code_submit', ([code, previousCode]) => {
    console.log('Code  ' + code + '  submitted by client ' + socket.id);
    // Check if the code is a valid code
    if (userIdToPlayerSocket[code]) {
      // Code is valid, check if code is being controlled by another client
      if (userIdToControllerSocket[code] === socket.id) {
        // Code is already being controlled by this client
        console.log('Code is already being controlled by this client');
        socket.emit('code_already_connected');
      } else if (userIdToControllerSocket[code]) {
        // Code is being controlled by another client
        // Send a message to the client that the code is already being controlled
        socket.emit('code_occupied');
        console.log('Code ' + code + ' is already being controlled by another client');
      } else {
        // Code is valid and not being used, add the controller
        if (userIdToPlayerSocket[previousCode]) {
          users[userIdToPlayerSocket[previousCode]].setAnimationState(Constants.PLAYER.ANIMATION.SLEEP.RIGHT);
        }
        delete userIdToControllerSocket[previousCode]

        var controller = new Controller(
          code, 
          socket.id, 
          userIdToPlayerSocket[code]
        );
        controllers[socket.id] = controller;
        userIdToControllerSocket[code] = socket.id;
        users[userIdToPlayerSocket[code]].setAnimationState(Constants.PLAYER.ANIMATION.IDLE.LEFT);

        console.log('Controller added for code ' + code);
        socket.emit('code_accepted');
      }
    } else {
      // Code is invalid
      console.log('Code ' + code + ' is invalid');
      socket.emit('code_invalid');
    }
  });

  socket.on('mouse_move', (data) => {
    var user = users[socket.id];
    if (user) {
      user.setMousePosition(data.x, data.y);
    }
  });

  socket.on('mouse_down', () => {
    var user = users[socket.id];
    if (user) {
      user.mouseDown = true;
    }
  });

  socket.on('mouse_up', () => {
    var user = users[socket.id];
    if (user) {
      user.mouseDown = false;
    }
  });

  socket.on('chat_message', (message) => {
    // Broadcast message to all users, without saving
    var messageResponse = {
      message: message,
      user: socket.id,
      time: new Date().toLocaleTimeString()
    }
    messageCache.push(messageResponse);
    if (messageCache.length > Constants.CHAT.MESSAGE_CACHE_SIZE) {
      messageCache.shift();
    }
    socket.emit('chat_message', messageResponse);
    socket.broadcast.emit('chat_message', messageResponse);
  });


  socket.on('disconnect', () => {
    // Remove the user from the user list
    if (users[socket.id]) {
      var user = users[socket.id];
      delete users[socket.id];
      delete userIdToPlayerSocket[user.id];    
      delete userIdToControllerSocket[user.id];

      socket.broadcast.emit('user_list', users);
      console.log('Desktop disconnected: ' + user.id);
    } else {
      // Remove the controller from the controller list
      if (controllers[socket.id]) {
        var controller = controllers[socket.id];
        delete controllers[socket.id];
        delete userIdToControllerSocket[controller.playerId];
        users[userIdToPlayerSocket[controller.playerId]].setAnimationState(Constants.PLAYER.ANIMATION.SLEEP.RIGHT);
        console.log('Controller disconnected for code ' + controller.playerId);
      }
    }
  });
});

// Position update loop
setInterval(() => {
  Object.values(users).forEach((user) => {
    user.update(userIdToControllerSocket);
  });
  io.emit('user_list', users)
}, Constants.SERVER.INTERVAL_RATE);

// Animation update loop
setInterval(() => {
  Object.values(users).forEach((user) => {
    user.animate();
  });
}, Constants.SERVER.ANIMATION_INTERVAL_RATE);

// Footstep loop
setInterval(() => {
  Object.values(users).forEach((user) => {
    user.addFootstep();
  });
}, Constants.SERVER.FOOTSTEP_INTERVAL_RATE);

server.listen(Constants.SERVER.PORT, () => {
  console.log(`Server listening on port ${Constants.SERVER.PORT}`);
});