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
  // randomly choose left or right starting direction
  this.direction = Math.random() > 0.5 ? 0 : 1;
  this.animationState = this.direction === 0 ? Constants.PLAYER.ANIMATION.SLEEP.LEFT : Constants.PLAYER.ANIMATION.SLEEP.RIGHT;
  this.animationFrame = 0;
  

  this.keyDown = function(key) {
    switch (key) {
      case 'ArrowUp':
      case 'up':
        this.moveUp = true;
        if (this.direction === 1) {
          this.setAnimationState(Constants.PLAYER.ANIMATION.WALK.RIGHT);
        } else {
          this.setAnimationState(Constants.PLAYER.ANIMATION.WALK.LEFT);
        }
        break;
      case 'ArrowLeft':
      case 'left':
        this.moveLeft = true;
        this.direction = 0;
        this.setAnimationState(Constants.PLAYER.ANIMATION.WALK.LEFT);
        break;
      case 'ArrowDown':
      case 'down':
        this.moveDown = true;
        if (this.direction === 1) {
          this.setAnimationState(Constants.PLAYER.ANIMATION.WALK.RIGHT);
        } else {
          this.setAnimationState(Constants.PLAYER.ANIMATION.WALK.LEFT);
        }
        break;
      case 'ArrowRight':
      case 'right':
        this.moveRight = true;
        this.direction = 1;
        this.setAnimationState(Constants.PLAYER.ANIMATION.WALK.RIGHT);
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

    // Set idle animation
    if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight) {
      switch (key) {
        case 'ArrowUp':
        case 'up':
          if (this.direction === 1) {
            this.setAnimationState(Constants.PLAYER.ANIMATION.IDLE.RIGHT);
          } else {
            this.setAnimationState(Constants.PLAYER.ANIMATION.IDLE.LEFT);
          }
          break;
        case 'ArrowLeft':
        case 'left':
          this.setAnimationState(Constants.PLAYER.ANIMATION.IDLE.LEFT);
          break;
        case 'ArrowDown':
        case 'down':
          if (this.direction === 1) {  
            this.setAnimationState(Constants.PLAYER.ANIMATION.IDLE.RIGHT);
          } else {
            this.setAnimationState(Constants.PLAYER.ANIMATION.IDLE.LEFT);
          }
          break;
        case 'ArrowRight':
        case 'right':
          this.setAnimationState(Constants.PLAYER.ANIMATION.IDLE.RIGHT);
          break;
      }
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

  this.animate = function() {
    switch (this.animationState) {
      case Constants.PLAYER.ANIMATION.IDLE.LEFT:
      case Constants.PLAYER.ANIMATION.IDLE.RIGHT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.IDLE.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationFrame = 0;
        }
        break;
      case Constants.PLAYER.ANIMATION.WALK.LEFT:
      case Constants.PLAYER.ANIMATION.WALK.RIGHT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.WALK.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationFrame = 0;
        }
        break;
      case Constants.PLAYER.ANIMATION.SLEEP.LEFT:
      case Constants.PLAYER.ANIMATION.SLEEP.RIGHT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.SLEEP.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationFrame = 0;
        }
        break;
    }
  }

  this.setAnimationState = function(animationState) {
    this.animationState = animationState;
    this.animationFrame = 0;
  }
}

export default Player;