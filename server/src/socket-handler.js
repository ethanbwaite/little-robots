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