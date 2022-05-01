(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var socket = io();
var socketHandler = require('./socket-handler.js')
var images = require('./images.js');
var constants = require('./constants.js');

var users = {}
var socketId = '';

socketHandler(socket);

socket.on('user_list', function(userList) {
  users = userList;
});

socket.on('device_check_handshake_start', function(id) {
  // Check if the device is mobile or desktop
  socketId = id;
  console.log(socketId);
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  socket.emit('device_check_handshake_end', {
    device: isMobile ? 'mobile' : 'desktop'
  });
});

window.requestAnimationFrame(function() {
    drawCanvas();
});

const preloadedImages = images.preloadImages();

function drawCanvas() {
  const userMap = users;
  var canvas = document.getElementById('canvas'); 

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (socketId.length > 0) {
      var userList = Object.values(userMap);
      for (var i = 0; i < userList.length; i++) {
        var user = userList[i];

        const IMAGE_SIZE_MULTIPLIER = 4;
        var image = image = preloadedImages.sleepRight[user.animationFrame];
        switch (user.animationState) {
          case constants.PLAYER.ANIMATION.IDLE.LEFT:
            image = preloadedImages.idleLeft[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.IDLE.RIGHT:
            image = preloadedImages.idleRight[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.WALK.LEFT:
            image = preloadedImages.walkLeft[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.WALK.RIGHT:
            image = preloadedImages.walkRight[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.SLEEP.LEFT:
            image = preloadedImages.sleepLeft[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.SLEEP.RIGHT:
            image = preloadedImages.sleepRight[user.animationFrame];
            break;
        }

        const drawPosX = user.x - (image.width / 2 * IMAGE_SIZE_MULTIPLIER);
        const drawPosY = user.y - (image.height * IMAGE_SIZE_MULTIPLIER);
        const width = image.width * IMAGE_SIZE_MULTIPLIER;
        const height = image.height * IMAGE_SIZE_MULTIPLIER;

        ctx.drawImage(image, drawPosX, drawPosY, width, height);

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
  }

  // request new frame
  window.requestAnimationFrame(function() {
    drawCanvas(userMap, socketId);
  });

  } else {
    console.log('Canvas not supported :(');
    // canvas-unsupported code here
  }
}


},{"./constants.js":2,"./images.js":3,"./socket-handler.js":4}],2:[function(require,module,exports){
module.exports = {
  PLAYER: {
    ANIMATION: {
      IDLE: {
        LEFT: 0,
        RIGHT: 1,        
        FRAMES: 4
      },
      WALK: {
        LEFT: 2,
        RIGHT: 3,
        FRAMES: 8
      },
      SLEEP: {
        LEFT: 4,
        RIGHT: 5,
        FRAMES: 4
      }
    }
  },
}
},{}],3:[function(require,module,exports){
module.exports.preloadImages = function () {
    var images = {
        idleRight: [],
        idleLeft: [],
        walkRight: [],
        walkLeft: [],
        sleepRight: [],
        sleepLeft: []
    }

    for (var i = 0; i < 4; i++) {
        images.idleRight.push(new Image());
        images.idleRight[i].src = './images/idleRight/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.idleLeft.push(new Image());
        images.idleLeft[i].src = './images/idleLeft/' + i + '.png';
    }

    for (var i = 0; i < 8; i++) {
        images.walkRight.push(new Image());
        images.walkRight[i].src = './images/walkRight/' + i + '.png';
    }

    for (var i = 0; i < 8; i++) {
        images.walkLeft.push(new Image());
        images.walkLeft[i].src = './images/walkLeft/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.sleepRight.push(new Image());
        images.sleepRight[i].src = './images/sleepRight/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.sleepLeft.push(new Image());
        images.sleepLeft[i].src = './images/sleepLeft/' + i + '.png';
    }

    return images
}
},{}],4:[function(require,module,exports){
module.exports = function socket(socket) {
  var code = '';

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
}
},{}]},{},[1]);
