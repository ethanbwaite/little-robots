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
  this.footsteps = [];
  this.mousePosition = { x: -100, y: -100 };
  this.mouseDown = false;
  this.mouseRadius = Constants.PLAYER.MOUSE_MAX_RADIUS;
  this.laserPointerOn = false;  


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
      case 'jump':
        const randomValue = Math.random()
        var animation = null;
        if (randomValue < 0.33) {
          animation = this.direction === 0 ? Constants.PLAYER.ANIMATION.JUMP.LEFT : Constants.PLAYER.ANIMATION.JUMP.RIGHT;
        } else if (randomValue < 0.66) {
          animation = this.direction === 0 ? Constants.PLAYER.ANIMATION.LICK.LEFT : Constants.PLAYER.ANIMATION.LICK.RIGHT;
        } else {
          animation = this.direction === 0 ? Constants.PLAYER.ANIMATION.POKE.LEFT : Constants.PLAYER.ANIMATION.POKE.RIGHT;
        }
        this.setAnimationState(animation);
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
        default:
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

    if (this.mouseDown) {
      if (this.mouseRadius > Constants.PLAYER.MOUSE_MIN_RADIUS) {
        this.mouseRadius -= this.mouseRadius * Constants.PLAYER.MOUSE_RADIUS_DECREASE_RATE;
      } else {
        this.laserPointerOn = true;
      }
    } else {
      this.laserPointerOn = false;
      this.mouseRadius = Constants.PLAYER.MOUSE_MAX_RADIUS;
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
      case Constants.PLAYER.ANIMATION.JUMP.LEFT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.JUMP.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationState = Constants.PLAYER.ANIMATION.IDLE.LEFT;
          this.animationFrame = 0;
        }
        break;
      case Constants.PLAYER.ANIMATION.JUMP.RIGHT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.JUMP.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationState = Constants.PLAYER.ANIMATION.IDLE.RIGHT;
          this.animationFrame = 0;
        }
        break;
      case Constants.PLAYER.ANIMATION.LICK.LEFT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.LICK.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationState = Constants.PLAYER.ANIMATION.IDLE.LEFT;
          this.animationFrame = 0;
        }
        break;
      case Constants.PLAYER.ANIMATION.LICK.RIGHT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.LICK.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationState = Constants.PLAYER.ANIMATION.IDLE.RIGHT;
          this.animationFrame = 0;
        }
        break;
      case Constants.PLAYER.ANIMATION.POKE.LEFT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.POKE.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationState = Constants.PLAYER.ANIMATION.IDLE.LEFT;
          this.animationFrame = 0;
        }
        break;
      case Constants.PLAYER.ANIMATION.POKE.RIGHT:
        if (this.animationFrame < Constants.PLAYER.ANIMATION.POKE.FRAMES - 1) {
          this.animationFrame++;
        } else {
          this.animationState = Constants.PLAYER.ANIMATION.IDLE.RIGHT;
          this.animationFrame = 0;
        }
        break;
    }
  }

  this.setAnimationState = function(animationState) {
    this.animationState = animationState;
    this.animationFrame = 0;
  }

  this.addFootstep = function() {
    // console.log(this.footsteps.length + ' footsteps');
    if (this.connected) {
      if (this.moveDown || this.moveUp || this.moveLeft || this.moveRight) {
        for (var i = 0; i < 2; i++) {
          const randX = Math.floor(Math.random() * (Constants.PLAYER.FOOTSTEP_RADIUS * 2)) - Constants.PLAYER.FOOTSTEP_RADIUS;
          const randY = Math.floor(Math.random() * (Constants.PLAYER.FOOTSTEP_RADIUS * 2)) - Constants.PLAYER.FOOTSTEP_RADIUS;
          this.footsteps.push([this.x + randX*2, this.y + randY]);
        }
        if (this.footsteps.length > Constants.PLAYER.MAX_FOOTSTEPS) {
          this.footsteps = this.footsteps.slice(2);
        }
      }
    }
  }

  this.setMousePosition = function(x, y) {
    this.mousePosition.x = x;
    this.mousePosition.y = y;
  }
}

export default Player;