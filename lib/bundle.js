/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);
const GameView = __webpack_require__(2);
const Avatar = __webpack_require__(3);

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("game-canvas");
  const game = new Game();

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  new GameView({ game, ctx }).start();
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Avatar = __webpack_require__(3);
const Platform = __webpack_require__(4);

class Game {
  constructor() {
    this.avatar = [];
    this.platforms = [new Platform({
      pos: [0, Game.DIM_Y-10],
      width: Game.DIM_X,
      color: this.randomColor()
    })];
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.keysPressed = {};
    this.addPlatforms();
    this.background = new Image();
    this.background.src = "./assets/images/background.png"
    this.canvasWrapper = document.getElementById('canvas-wrapper');
  }

  addAvatar( ) {
    const avatar = new Avatar({
      pos: [250, Game.DIM_Y - 80]
    })
    this.avatar.push(avatar);
    return avatar;
  }

  addPlatforms() {
    for (let i = 75; i < Game.DIM_Y; i += 85) {
      const platform = new Platform({
        pos: [this.randomPosition(), i],
        width: this.randomWidth(),
        color: this.randomColor()
      });
      this.platforms.push(platform);
    }
  }

  allObjects() {
    return this.avatar.concat(this.platforms).reverse();
  }

  checkLandings() {
    this.platforms.forEach(platform => this.avatar[0].landedOn(platform))
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.drawImage(this.background, 0, 0)
    this.scrollBackground(ctx);
    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
  }

  handleKeyDown(event) {
    this.keysPressed[event.key] = true;
    event.preventDefault();
  }

  handleKeyUp(event) {
    this.keysPressed[event.key] = false;
  }

  randomPosition() {
    return Math.floor(Math.random() * (Game.DIM_X - 150))
  }

  randomColor() {
    const colorCodes = "0123456789ABCDEF"
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += colorCodes[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  randomWidth() {
    return Math.floor(Game.DIM_X * .25 + Game.DIM_X * Math.random() * .25);
  }

  removeObject(object) {
    if (object instanceof Avatar ) {
      this.avatar = [];
    }
    if (object instanceof Platform ) {
      this.platforms.splice(this.platforms.indexOf(object), 1);
    }
  }
  
  scrollBackground() {
    this.canvasWrapper.scrollTop = this.avatar[0].pos[1]-300;
  }

  tick(timeDelta) {
    if (this.keysPressed["ArrowLeft"]) { this.avatar[0].accelerate("L"); }
    if (this.keysPressed["ArrowRight"]) { this.avatar[0].accelerate("R"); }
    if (this.keysPressed[" "]) { this.avatar[0].jump(); }
    this.avatar[0].move(timeDelta);
    this.checkLandings();
  }
}

Game.DIM_X = 600;
Game.DIM_Y = 11745;

module.exports = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class GameView {
  constructor(props) {
    this.ctx = props.ctx;
    this.game = props.game;
    this.avatar = this.game.addAvatar();
    this.fps = props.fps || 60;
  }

  start() {
    this.lastTimestamp = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(timestamp) {
    // CONVERT TIMEDELTA FROM MS TO S
    const timeDelta = (timestamp - this.lastTimestamp)/1000;
    this.lastTimestamp = timestamp;
    this.game.tick(timeDelta);
    this.game.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = GameView;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

class Avatar {
  constructor(props) {
    this.image = new Image();
    this.image.src = "./assets/images/fiery_tower_character.png"
    this.pos = props.pos;
    this.vel = [0, 0];
    this.jumping = false;
    this.onLand = false;
    this.falling = false;
    this.height = 52;
    this.width = 30;
    this.gravity = 120;
  }

  accelerate(dir) {
    // debugger
    switch (dir) {
      case "L":
        if (this.vel[0] > 0) { this.vel[0] -= 10 }
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] -= 15; }
        if (Math.abs(this.vel[0]) > Avatar.MAX_SPEED ) { this.vel[0] =  -Avatar.MAX_SPEED; }
        break;
      case "R":
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] += 15; }
        if (this.vel[0] < 0) { this.vel[0] += 10 }
        if (Math.abs(this.vel[0]) > Avatar.MAX_SPEED ) { this.vel[0] = Avatar.MAX_SPEED; }
        break;
      default:
        return;
    }
  }

  correctPositions() {
    if ( this.pos[0] < 0 ) { this.pos[0] = 0; this.vel[0] = -this.vel[0]; }
    if ( this.pos[0] > 570 ) { this.pos[0] = 570; this.vel[0] = -this.vel[0];}
    // if ( this.pos[1] > 550 ) { this.pos[1] = 550; this.vel[1] = 0; this.jumping = false; }
  }

  decelerate(timeDelta) {
    if (this.vel[0] > 0) { this.vel[0] -= 2; }
    if (this.vel[0] < 0) { this.vel[0] += 2; }
    // SIMULATED GRAVITY
    this.vel[1] += this.gravity * timeDelta;
  }

  draw(ctx) {
    const { sourceX, sourceY, sourceWidth, sourceHeight } = this.sprite();
    ctx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0], this.pos[1], this.width, this.height);
  }

  jump() {
    if (!this.jumping) {
      this.onLand = false;
      this.jumping = true;
      if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED * .33) {
        this.vel[1] -= 140;
      }
      else if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED * .85) {
        this.vel[1] -= 220;
      }
      else {
        this.vel[1] -= 300;
      }
    }
  }

  landed(platform) {
    this.jumping = false;
    this.falling = false;
    this.onLand = true;
    // debugger
    this.vel[1] = 0;
    this.pos[1] = platform.pos[1]-this.height-.001;
  }

  landedOn(platform) {
    if (this.falling) {
      if (this.pos[1]+this.height < platform.pos[1]+10
        && this.pos[1]+this.height > platform.pos[1]
        && this.pos[0]+this.width > platform.pos[0]
        && this.pos[0] < platform.pos[0] + platform.width) {
          this.landed(platform);
        }
        else {
          return;
        }
    }
    return;
  }

  move(timeDelta) {
    (this.vel[1] > 0) ? this.falling = true : this.falling = false;
    const scaledOffset = [this.vel[0] * timeDelta, this.vel[1] * timeDelta];
    this.pos = [this.pos[0] + scaledOffset[0], this.pos[1] + scaledOffset[1]];
    this.correctPositions();
    console.log(this.falling);
    // DECELERATE EVERY TICK
    this.decelerate(timeDelta);
  }

  sprite() {
    // HANDLES LOGIC FOR WHAT SPRITE TO USE, PLACEHOLDER
    return {
      sourceHeight: 52,
      sourceWidth: 30,
      sourceX: 1,
      sourceY: 4
    };
  }
}

Avatar.MAX_SPEED = 450;

module.exports = Avatar;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

class Platform {
  constructor(props) {
    this.pos = props.pos;
    this.width = props.width;
    this.color = props.color;
  }

  draw(ctx) {
    ctx.beginPath();
    // debugger
    ctx.rect(this.pos[0], this.pos[1], this.width, 10);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

module.exports = Platform;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map