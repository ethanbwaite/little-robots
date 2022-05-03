export const Constants = {
  SERVER: {
    PORT: 8080,
    INTERVAL_RATE: 1000 / 30,
    ANIMATION_INTERVAL_RATE: 1000 / 10,
    FOOTSTEP_INTERVAL_RATE: 1000 / 5,
  },
  PLAYER: {
    MAX_SPEED: 10,
    DIAGONAL_MULTIPLIER: 0.70711,
    MAX_FOOTSTEPS: 25,
    FOOTSTEP_RADIUS: 8,
    MOUSE_MAX_RADIUS: 2000,
    MOUSE_MIN_RADIUS: 3,
    MOUSE_RADIUS_DECREASE_RATE: 0.3,
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
  CONTROLLER: {
  },
  CANVAS: {
    WIDTH: 1000,
    HEIGHT: 1000,
  },
  CHAT: {
    MESSAGE_CACHE_SIZE: 100,
  }
};