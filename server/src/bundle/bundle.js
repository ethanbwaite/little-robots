(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var socketHandler = require('./socket-handler.js')

socketHandler();

},{"./socket-handler.js":3}],2:[function(require,module,exports){
module.exports = function drawCanvas(userMap) {
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
    }

    console.log('canvas is supported');
  } else {
    // canvas-unsupported code here
  }
}
},{}],3:[function(require,module,exports){
var drawCanvas = require('./canvas.js');

module.exports = function socket() {
    var socket = io();
    
    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');

    document.addEventListener('keydown', function(e) {
        socket.emit('key_down', e.key);
    });

    document.addEventListener('keyup', function(e) {
        socket.emit('key_up', e.key);
    });

    socket.on('user_list', function(userList) {
        console.log('user_list');
        drawCanvas(userList);
    });


        


    // form.addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     if (input.value) {
    //     socket.emit('chat message', input.value);
    //     input.value = '';
    //     }
    // });

    // socket.on('chat message', function(msg) {
    //     var li = document.createElement('li');
    //     li.textContent = msg;
    //     messages.appendChild(li);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });

    // socket.on('user disconnected', function(msg) {
    //     var li = document.createElement('li');
    //     li.textContent = 'User has disconnected';
    //     messages.appendChild(li);
    //     window.scrollTo(0, document.body.scrollHeight);
    // });
}
},{"./canvas.js":2}]},{},[1]);
