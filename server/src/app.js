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
        ctx.textAlign = 'center';

        if (user.connected) {
          ctx.fillStyle='green';
          ctx.fillText('Connected', user.x, user.y + 10);
        } else {
          ctx.fillStyle = 'red';
          ctx.fillText('Not connected', user.x, user.y + 10);
        }
        if (user.socket === socketId) {
          ctx.beginPath();
          if (!user.connected) {
            // Draw a rounded centered rectangle
            const rectWidth = 56;
            const rectHeight = 35;
            ctx.roundRect(user.x - (rectWidth / 2), user.y - 82, rectWidth, rectHeight, 9);
            ctx.fillStyle = 'lightgrey';
            ctx.fill();

            // Draw a downward pointing triangle at the bottom of the rectangle
            ctx.beginPath();
            ctx.moveTo(user.x - 5, user.y - 82 + rectHeight);
            ctx.lineTo(user.x, user.y - 82 + 5 + rectHeight);
            ctx.lineTo(user.x + 5, user.y - 82 + rectHeight);
            ctx.fill()
            
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(user.id, user.x, user.y - 55);
            ctx.fillStyle = 'black';
            ctx.font = 'bold 10px Arial';
            ctx.fillText('You', user.x, user.y - 70);
          } else {
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('You', user.x, user.y - 55);
          }


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

