module.exports = function socket(socket) {
  var code = '';
  var desktop = false;

  socket.on('show_mobile_controls', function() {
    // Hide the canvas and show the mobile controls
    var previousCode = code;
    console.log('Displaying mobile controls');
    document.getElementById('background').style.backgroundColor = '#FEF5EF';
    document.getElementById('client').style.display = 'none';
    document.getElementById('controller').style.display = 'flex';
    document.getElementById('submit').addEventListener('click', function(e) {
      e.preventDefault();
      code = document.getElementById('codeInput').value;
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
        document.getElementById('codeInput').value = code;
        socket.emit('code_submit', [code, previousCode]);
      }
    }
  });
      
  socket.on('show_canvas', function() {
    // Hide the mobile controls and show the canvas
    desktop = true;
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
    if (desktop) {
      console.log('Updating chat');
      showMessage(message);
      
      // Scroll to bottom
      var chat = document.getElementById('chat');
      chat.scrollTop = chat.scrollHeight; 
    }
  });

  socket.on('chat_cache', function(chatCache) {
    // Load list of previous chat messages
    if (desktop) {
      console.log('Loading chat cache');
      for (var i = 0; i < chatCache.length; i++) {
        showMessage(chatCache[i]);
      }

      // Scroll to bottom
      var chat = document.getElementById('chat');
      chat.scrollTop = chat.scrollHeight; 
    }
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