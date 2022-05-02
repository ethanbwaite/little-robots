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
      userList.sort(function(a, b) {
        return a.y - b.y;
      });

      // Draw mouse position circle underneath everthing
      for (var i = 0; i < userList.length; i++) {
        var user = userList[i];
        var text = 'Click for laser pointer';
        if ((user.mouseDown && user.socket === socketId) || user.laserPointerOn) {
          ctx.beginPath();
          ctx.fillStyle = user.laserPointerOn ? 'red' : '#ece9d2';
          ctx.arc(user.mousePosition.x, user.mousePosition.y, user.mouseRadius, 0, 2 * Math.PI);
          ctx.fill();
          text = 'Hold';
        }
        if (user.socket === socketId && !user.laserPointerOn && user.mousePosition.x > 10 
          && user.mousePosition.y > 10 && user.mousePosition.x < canvas.width - 10 
          && user.mousePosition.y < canvas.height - 10) {
          ctx.fillStyle = '#7f5539';
          ctx.font = '10px Arial';
          ctx.fillText(text, user.mousePosition.x, user.mousePosition.y - 10);
        }
      }

      // Draw footsteps underneath everything else
      for (var i = 0; i < userList.length; i++) {

        var user = userList[i];
        // Draw footsteps
        for (var j = 0; j < user.footsteps.length; j++) {
          var footstep = user.footsteps[j];
          ctx.beginPath();
          ctx.fillStyle = '#faedcd';
          ctx.ellipse(footstep[0], footstep[1], 4, 2, 0, 2 * Math.PI, 0);
          ctx.fill()
        }
      }

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
          case constants.PLAYER.ANIMATION.JUMP.LEFT:
            image = preloadedImages.jumpLeft[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.JUMP.RIGHT:
            image = preloadedImages.jumpRight[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.LICK.LEFT:
            image = preloadedImages.lickLeft[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.LICK.RIGHT:
            image = preloadedImages.lickRight[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.POKE.LEFT:
            image = preloadedImages.pokeLeft[user.animationFrame];
            break;
          case constants.PLAYER.ANIMATION.POKE.RIGHT:
            image = preloadedImages.pokeRight[user.animationFrame];
            break;
        }

        const drawPosX = user.x - (image.width / 2 * IMAGE_SIZE_MULTIPLIER);
        const drawPosY = user.y - (image.height * IMAGE_SIZE_MULTIPLIER);
        const width = image.width * IMAGE_SIZE_MULTIPLIER;
        const height = image.height * IMAGE_SIZE_MULTIPLIER;

        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        if (user.connected) {
          ctx.fillStyle='green';
          ctx.fillText('Connected', user.x, user.y + 10);
        } else {
          ctx.fillStyle = '#7f5539';
          ctx.fillText('Not connected', user.x, user.y + 10);
        }
        if (user.socket === socketId) {
          ctx.beginPath();
          // Draw a rounded centered rectangle
          const rectWidth = 56;
          const rectHeight = 35;
          drawRoundRect(user.x - (rectWidth / 2), user.y - 87, rectWidth, rectHeight, 9, ctx);
          ctx.fillStyle = '#faedcd';
          ctx.fill();

          // Draw a downward pointing triangle at the bottom of the rectangle
          ctx.beginPath();
          ctx.moveTo(user.x - 5, user.y - 87 + rectHeight);
          ctx.lineTo(user.x, user.y - 82 + 5 + rectHeight);
          ctx.lineTo(user.x + 5, user.y - 87 + rectHeight);
          ctx.fill()

          if (!user.connected) {
            ctx.fillStyle = '#7f5539';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(user.id, user.x, user.y - 60);
            ctx.fillStyle = '#7f5539';
            ctx.font = 'bold 10px Arial';
            ctx.fillText('You', user.x, user.y - 75);
          } else {
            ctx.fillStyle = '#7f5539';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('You', user.x, user.y - 65);
          }
        }
        ctx.drawImage(image, drawPosX, drawPosY, width, height);
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

function drawRoundRect(x, y, w, h, r, ctx) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}

