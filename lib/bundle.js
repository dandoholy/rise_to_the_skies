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

  canvasEl.width = game.DIM_X;
  canvasEl.height = game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  new GameView({ game, ctx }).start();
});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Avatar = __webpack_require__(3);

class Game {
  constructor() {
    this.DIM_X = 500;
    this.DIM_Y = 600;
    this.avatar = [];
    this.platforms = [];
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.keysPressed = {};
  }

  addAvatar( ) {
    const avatar = new Avatar({
      pos: [100, 600]
    })
    this.avatar.push(avatar);
    return avatar;
  }

  addPlatforms() {
    for (let i = 0; i < 5; i++) {
      const platform = new Platform({
        pos: [this.randomPosition(), 20]
      })
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    // ctx.fillStyle = Game.BG_COLOR;
    // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.avatar[0].draw(ctx)
    // this.allObjects().forEach((object) => {
    //   object.draw(ctx);
    // });
  }

  handleKeyDown(event) {
    this.keysPressed[event.key] = true;
    event.preventDefault();
  }

  handleKeyUp(event) {
    this.keysPressed[event.key] = false;
  }

  randomPosition() {
    return Math.random() * this.DIM_X
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
    return Game.X_DIM * .25 + Game.X_DIM * Math.random() * .4
  }

  removeObject(object) {
    if (object instanceof Avatar ) {
      this.avatar = [];
    }
    if (object instanceof Platform ) {
      this.platforms.splice(this.platforms.indexOf(object), 1);
    }
  }

  tick(timeDelta) {
    if (this.keysPressed["ArrowLeft"]) { this.avatar[0].accelerate("L"); }
    if (this.keysPressed["ArrowRight"]) { this.avatar[0].accelerate("R"); }
    if (this.keysPressed[" "]) { this.avatar[0].jump(); }
    this.avatar[0].move(timeDelta);
  }
}

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
    this.landed = false;
    // this.falling = false;
    this.height = 52;
    this.width = 30;
    this.gravity = 120;
  }

  accelerate(dir) {
    // debugger
    switch (dir) {
      case "L":
        if (this.vel[0] > 0) { this.vel[0] -= 10 }
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] -= 20; }
        break;
      case "R":
        if (Math.abs(this.vel[0]) < Avatar.MAX_SPEED ) { this.vel[0] += 20; }
        if (this.vel[0] < 0) { this.vel[0] += 10 }
        break;
      default:
        return;
    }
  }

  checkOutofBounds() {
    if ( this.pos[0] < 0 ) { this.pos[0] = 0; }
    if ( this.pos[0] > 470 ) { this.pos[0] = 470; }
    if ( this.landed ) { this.pos[1] = 500; this.vel[1] = 0; this.jumping = false; }
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
    (this.landed) ? console.log("landed") : console.log("jumping")
  }

  jump() {
    if (!this.jumping) {
      this.vel[1] -= 180;
      this.landed = false;
      this.jumping = true;
    }
  }

  landed() {
    this.jumping = false;
    this.landed = true;
  }

  landed_on(platform) {
    if (this.pos[1] > platform.pos[1] && this.pos[0] > platform.pos[0]
      && this.pos[0]+this.width < platform.pos[0] + platform.width) {
        return true;
      }
    else {
      return false;
    }
  }

  move(timeDelta) {
    const scaledOffset = [this.vel[0] * timeDelta, this.vel[1] * timeDelta];
    this.pos = [this.pos[0] + scaledOffset[0], this.pos[1] + scaledOffset[1]];
    this.checkOutofBounds();
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

Avatar.MAX_SPEED = 200;

module.exports = Avatar;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map