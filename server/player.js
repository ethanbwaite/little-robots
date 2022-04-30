import { Constants } from './constants.js';

function Player(id, socket, x, y) {
  this.id = id;
  this.socket = socket;
  this.x = x;
  this.y = y;
  this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);    
  this.moveUp = false;
  this.moveDown = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.connected = false;


  this.keyDown = function(key) {
    switch (key) {
      case 'ArrowUp':
      case 'up':
        this.moveUp = true;
        break;
      case 'ArrowLeft':
      case 'left':
        this.moveLeft = true;
        break;
      case 'ArrowDown':
      case 'down':
        this.moveDown = true;
        break;
      case 'ArrowRight':
      case 'right':
        this.moveRight = true;
        break;
    }
  }

  this.keyUp = function(key) {
    switch (key) {
      case 'ArrowUp':
      case 'up':
        this.moveUp = false;
        break;
      case 'ArrowLeft':
      case 'left':
        this.moveLeft = false;
        break;
      case 'ArrowDown':
      case 'down':
        this.moveDown = false;
        break;
      case 'ArrowRight':
      case 'right':
        this.moveRight = false;
        break;
    }
  }

  this.update = function(userIdToControllerSocket) {
    var speed = Constants.PLAYER.MAX_SPEED;
    if ((this.moveUp && this.moveLeft) || 
      (this.moveUp && this.moveRight) || 
      (this.moveDown && this.moveLeft) || 
      (this.moveDown && this.moveRight)) {
      speed *= Constants.PLAYER.DIAGONAL_MULTIPLIER;
    }

    if (this.moveUp) {
      this.y -= speed;
    }
    if (this.moveDown) {
      this.y += speed;
    }
    if (this.moveLeft) {
      this.x -= speed;
    }
    if (this.moveRight) {
      this.x += speed;
    }

    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > Constants.CANVAS.WIDTH) {
      this.x = Constants.CANVAS.WIDTH;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > Constants.CANVAS.HEIGHT) {
      this.y = Constants.CANVAS.HEIGHT;
    }

    // Check if the player is being controlled
    if (userIdToControllerSocket[this.id]) {
      this.connected = true;
    } else {
      this.connected = false;
    }
  }
}

export default Player;