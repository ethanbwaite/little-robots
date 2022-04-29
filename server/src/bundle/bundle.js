(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var drawCanvas = require('./canvas.js');
var socketHandler = require('./socket-handler.js')

socketHandler();
drawCanvas();
},{"./canvas.js":2,"./socket-handler.js":3}],2:[function(require,module,exports){
module.exports = function drawCanvas() {
  var canvas = document.getElementById('canvas');

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(200,0,0)';
    ctx.fillRect(25, 25, 100, 100);
    console.log('canvas is supported');
  } else {
    // canvas-unsupported code here
  }
}
},{}],3:[function(require,module,exports){
module.exports = function socket() {
    var socket = io();
    
    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');

    document.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowUp':
                socket.emit('up_pressed');
                break;
            case 'ArrowDown':
                socket.emit('down_pressed');
                break;
            case 'ArrowLeft':
                socket.emit('left_pressed');
                break;
            case 'ArrowRight':
                socket.emit('right_pressed');
                break;
        }
    });

    document.addEventListener('keyup', function(e) {
        switch (e.key) {
            case 'ArrowUp':
                socket.emit('up_released');
                break;
            case 'ArrowDown':
                socket.emit('down_released');
                break;
            case 'ArrowLeft':
                socket.emit('left_released');
                break;
            case 'ArrowRight':
                socket.emit('right_released');
                break;
        }
    });
}
},{}]},{},[1]);
