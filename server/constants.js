export const Constants = {
  SERVER: {
    PORT: 8080,
    INTERVAL_RATE: 1000 / 60,
    ANIMATION_INTERVAL_RATE: 1000 / 10,
  },
  PLAYER: {
    MAX_SPEED: 5,
    DIAGONAL_MULTIPLIER: 0.70711,
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
      }
    }
  },
  CONTROLLER: {
  },
  CANVAS: {
    WIDTH: 1000,
    HEIGHT: 1000,
  }
      
};