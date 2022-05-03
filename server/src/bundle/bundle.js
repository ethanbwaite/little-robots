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
      },
      JUMP: {
        LEFT: 6,
        RIGHT: 7,
        FRAMES: 7
      },
      LICK: {
        LEFT: 8,
        RIGHT: 9,
        FRAMES: 4
      },
      POKE: {
        LEFT: 10,
        RIGHT: 11,
        FRAMES: 6
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
        sleepLeft: [],
        jumpRight: [],
        jumpLeft: [],
        lickRight: [],
        lickLeft: [],
        pokeRight: [],
        pokeLeft: [],
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

    for (var i = 0; i < 7; i++) {
        images.jumpRight.push(new Image()); 
        images.jumpRight[i].src = './images/jumpRight/' + i + '.png';
    }

    for (var i = 0; i < 7; i++) {
        images.jumpLeft.push(new Image());
        images.jumpLeft[i].src = './images/jumpLeft/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.lickRight.push(new Image());
        images.lickRight[i].src = './images/lickRight/' + i + '.png';
    }

    for (var i = 0; i < 4; i++) {
        images.lickLeft.push(new Image());
        images.lickLeft[i].src = './images/lickLeft/' + i + '.png';
    }

    for (var i = 0; i < 6; i++) {
        images.pokeRight.push(new Image());
        images.pokeRight[i].src = './images/pokeRight/' + i + '.png';
    }

    for (var i = 0; i < 6; i++) {
        images.pokeLeft.push(new Image());
        images.pokeLeft[i].src = './images/pokeLeft/' + i + '.png';
    }

    return images
}

},{}],4:[function(require,module,exports){
module.exports = function socket(socket) {
  var code = '';

  socket.on('show_mobile_controls', function() {
    // Hide the canvas and show the mobile controls
    var previousCode = code;
    console.log('Displaying mobile controls');
    document.getElementById('background').style.backgroundColor = '#FEF5EF';
    document.getElementById('client').style.display = 'none';
    document.getElementById('controller').style.display = 'flex';
    document.getElementById('submit').addEventListener('click', function(e) {
      e.preventDefault();
      code = document.getElementById('code').value;
      socket.emit('code_submit', [code, previousCode]);
    });

    // Add listeners for mobile controller keypresses
    ['up', 'down', 'left', 'right', 'jump'].forEach((direction) => {
      document.getElementById(`${direction}Button`).addEventListener('touchstart', function(e) {
        console.log(`${direction}Button touchstart`);
        socket.emit('controller_key_down', direction);
      });

      document.getElementById(`${direction}Button`).addEventListener('touchend', function(e) {
        console.log(`${direction}Button touchend`);
        socket.emit('controller_key_up', direction);
      });
    });
    
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search)
      if (searchParams.has('code')) {
        code = searchParams.get('code');
        document.getElementById('code').value = code;
        socket.emit('code_submit', [code, previousCode]);
      }
    }
  });
      
  socket.on('show_canvas', function() {
    // Hide the mobile controls and show the canvas
    console.log('Displaying canvas');
    document.getElementById('client').style.display = 'flex';
    document.getElementById('controller').style.display = 'none';
    var canvas = document.getElementById('canvas');
    canvas.addEventListener("mousemove", function(e) {
      var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
      var canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
      var canvasY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
      // ctx.clearRect(0, 0, canvas.width, canvas.height);  // (0,0) the top left of the canvas
      // ctx.fillStyle = '#ffffff';
      // ctx.fillText("X: "+canvasX+", Y: "+canvasY, 10, 20);
      socket.emit('mouse_move', {x: canvasX, y: canvasY});
    });
    canvas.addEventListener("mousedown", function(e) {
      socket.emit('mouse_down');
    });
    canvas.addEventListener("mouseup", function(e) {
      socket.emit('mouse_up');
    });
    document.getElementById('chatInput').addEventListener('keydown', function(e) {
      // Listen for Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        var message = document.getElementById('chatInput').value;
        socket.emit('chat_message', message);
        document.getElementById('chatInput').value = '';
      }
    });

    // document.addEventListener('keydown', function(e) {
    //   socket.emit('player_key_down', e.key);
    // });

    // document.addEventListener('keyup', function(e) {
    //   socket.emit('player_key_up', e.key);
    // });
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

  socket.on('stats', function(stats) {
    // Update stats
    console.log('Updating stats');
    document.getElementById('kittyCount').innerHTML = `Total kitties visited: ${stats.kittyCount}`;
    document.getElementById('maxKitty').innerHTML = `Highest kitty count: ${stats.maxKittyCount}`;
  });

  socket.on('code', function(code) {
    // Update code
    console.log('Updating code');
    document.getElementById('codeHeading').innerHTML = `${code}`; 
    if ('URLSearchParams' in window) {
      var searchParams = new URLSearchParams(window.location.search)
      searchParams.set("code", `${code}`);
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.pushState(null, '', newRelativePathQuery);
    }

    var qrcode = new QRious({
      element: document.getElementById("qrCode"),
      background: 'black',
      backgroundAlpha: 0,
      foreground: '#fefae0',
      foregroundAlpha: 1,
      level: 'L',
      padding: 0,
      size: 75,
      value: window.location.href
    });
    console.log(window.location.href);
  });

  socket.on('chat_message', function(message) {
    // Update chat
    console.log('Updating chat');
    showMessage(message);
    
    // Scroll to bottom
    var chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight; 
  });

  socket.on('chat_cache', function(chatCache) {
    // Load list of previous chat messages
    console.log('Loading chat cache');
    for (var i = 0; i < chatCache.length; i++) {
      showMessage(chatCache[i]);
    }
    
    // Scroll to bottom
    var chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight; 
  });
}

function showMessage(message) {
  var chatMessage = document.createElement('p');
  chatMessage.className = 'chatMessage';
  chatMessage.innerHTML = `${message.message}`;
  
  var chatTime = document.createElement('p');
  chatTime.className = 'chatTime';
  chatTime.innerHTML = `${message.time}`;

  document.getElementById('chat').appendChild(chatMessage);
  document.getElementById('chat').appendChild(chatTime);
}
},{}]},{},[1]);
