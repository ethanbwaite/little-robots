import { Constants } from './constants.js';

function User(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);    
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;


    this.keyDown = function(key) {
        switch (key) {
            case 'ArrowUp':
                this.moveUp = true;
                break;
            case 'ArrowLeft':
                this.moveLeft = true;
                break;
            case 'ArrowDown':
                this.moveDown = true;
                break;
            case 'ArrowRight':
                this.moveRight = true;
                break;
        }
    }

    this.keyUp = function(key) {
        switch (key) {
            case 'ArrowUp':
                this.moveUp = false;
                break;
            case 'ArrowLeft':
                this.moveLeft = false;
                break;
            case 'ArrowDown':
                this.moveDown = false;
                break;
            case 'ArrowRight':
                this.moveRight = false;
                break;
        }
    }

    this.update = function() {
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
    }
}

export default User;