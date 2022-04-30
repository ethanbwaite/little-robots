(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var socketHandler = require('./socket-handler.js')

socketHandler();

},{"./socket-handler.js":3}],2:[function(require,module,exports){
module.exports = function drawCanvas(userMap, socketId) {
  var canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var users = Object.values(userMap);
    for (var i = 0; i < users.length; i++) {
      var user = users[i];

      ctx.beginPath();
      ctx.arc(user.x, user.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = user.color;
      ctx.fill();
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      if (user.connected) {
        ctx.fillText('Connected', user.x, user.y + 35);
      } else {
        ctx.fillText('Not connected', user.x, user.y + 35);
      }
      if (user.socket === socketId) {
        ctx.fillText(user.id, user.x, user.y + 25);
        ctx.fillStyle = 'red';
        ctx.fillText('You', user.x, user.y + 45);
      }
    }

  } else {
    console.log('Canvas not supported :(');
    // canvas-unsupported code here
  }
}
},{}],3:[function(require,module,exports){
var drawCanvas = require('./canvas.js');

module.exports = function socket() {
  var socket = io();
  var code = '';
  var socketId = '';

  socket.on('device_check_handshake_start', function(id) {
    // Check if the device is mobile or desktop
    socketId = id;
    console.log(socketId);
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    socket.emit('device_check_handshake_end', {
        device: isMobile ? 'mobile' : 'desktop'
    });
  });

  socket.on('show_mobile_controls', function() {
    // Hide the canvas and show the mobile controls
    console.log('Displaying mobile controls');
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('controller').style.display = 'flex';
    document.getElementById('submit').addEventListener('click', function(e) {
      e.preventDefault();
      var previousCode = code;
      code = document.getElementById('code').value;

      socket.emit('code_submit', [code, previousCode]);
    });

    // Add listeners for mobile controller keypresses
    ['up', 'down', 'left', 'right'].forEach((direction) => {
      document.getElementById(`${direction}Button`).addEventListener('touchstart', function(e) {
        console.log(`${direction}Button touchstart`);
        socket.emit('controller_key_down', direction);
      });

      document.getElementById(`${direction}Button`).addEventListener('touchend', function(e) {
        console.log(`${direction}Button touchend`);
        socket.emit('controller_key_up', direction);
      });
    });
    
  });
      
  socket.on('show_canvas', function() {
    // Hide the mobile controls and show the canvas
    console.log('Displaying canvas');
    document.getElementById('canvas').style.display = 'flex';
    document.getElementById('controller').style.display = 'none';

    document.addEventListener('keydown', function(e) {
      socket.emit('player_key_down', e.key);
    });

    document.addEventListener('keyup', function(e) {
      socket.emit('player_key_up', e.key);
    });
  });

  socket.on('code_already_connected', function() {
    // Code already controlled by another player
    console.log('Code already controlled');
    document.getElementById('connectionMessage').innerHTML = 'Already connected to this code';
    document.getElementById('connectionMessage').style.color = 'green';
  });

  socket.on('code_occupied', function() {
    // Code already controlled by another player
    console.log('Code occupied');
    document.getElementById('connectionMessage').innerHTML = 'Code is already being controlled';
    document.getElementById('connectionMessage').style.color = 'red';
  });

  socket.on('code_invalid', function() {
    // Code invalid
    console.log('Code invalid');
    document.getElementById('connectionMessage').innerHTML = 'Not a code';
    document.getElementById('connectionMessage').style.color = 'red';
  });

  socket.on('code_accepted', function() {
    // Code accepted
    console.log('Code accepted');
    document.getElementById('connectionMessage').innerHTML = 'Connected!';
    document.getElementById('connectionMessage').style.color = 'green';
  });

  socket.on('controller_lost_connection', function() {
    // Controller lost connection
    console.log('Controller lost connection');
    document.getElementById('connectionMessage').innerHTML = 'Controller lost connection';
    document.getElementById('connectionMessage').style.color = 'red';
  });

  socket.on('user_list', function(userList) {
    drawCanvas(userList, socketId);
  });
}
},{"./canvas.js":2}]},{},[1]);
