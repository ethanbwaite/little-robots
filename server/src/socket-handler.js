var drawCanvas = require('./canvas.js');

module.exports = function socket() {
  var socket = io();

  socket.on('device_check_handshake_start', function() {
    // Check if the device is mobile or desktop
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
      socket.emit('code_submit', document.getElementById('name').value);
    });
    document.getElementById('upButton').addEventListener('touchstart', function(e) {
      e.preventDefault();
      socket.emit('controller_key_down', 'up');
    });
    document.getElementById('upButton').addEventListener('touchend', function(e) {
      e.preventDefault();
      socket.emit('controller_key_up', 'up');
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

  socket.on('user_list', function(userList) {
    drawCanvas(userList);
  });

}