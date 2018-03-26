const Avatar = require('./avatar');
const Platform = require('./platforms');
const ModalManager = require('./modal');

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
    this.score = 0;
    this.gameOver = false;
  }

  addAvatar( ) {
    const avatar = new Avatar({
      pos: [250, Game.DIM_Y - 80]
    })
    this.avatar.push(avatar);
    return avatar;
  }

  addPlatforms() {
    for (let i = Game.DIM_Y-100; i > 0; i -= 100) {
      const platform = new Platform({
        pos: [this.randomPosition(), i],
        // PLATFORMS GET NARROWER WITH HEIGHT
        width: this.randomWidth() * (i)/Game.DIM_Y*.993,
        color: this.randomColor()
      });
      this.platforms.push(platform);
    }
  }

  allObjects() {
    return this.avatar.concat(this.platforms).reverse();
  }

  checkGameOver() {
    let currScore = Math.floor(Game.DIM_Y - this.avatar[0].pos[1] - 80);
    if (currScore < this.score-500) {
      this.avatar[0].pos = [800, this.avatar[0].pos[1]];
      this.gameOver = true;
      new ModalManager().openModal();
    }
    return false;
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
    if (event.key == "Enter" && this.gameOver) { this.reset(); }

    // event.preventDefault();
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
    return Math.floor(Game.DIM_X * .25 + Game.DIM_X * Math.random() * .15);
  }

  removeObject(object) {
    if (object instanceof Avatar ) {
      this.avatar = [];
    }
    if (object instanceof Platform ) {
      this.platforms.splice(this.platforms.indexOf(object), 1);
    }
  }

  reset() {
    new ModalManager().closeModal();
    this.score = 0;
    this.platforms = [new Platform({
      pos: [0, Game.DIM_Y-10],
      width: Game.DIM_X,
      color: this.randomColor()
    })];
    this.gameOver = false;
    this.addPlatforms();
    this.resetAvatar();
  }

  resetAvatar() {
    this.avatar[0].pos = [250, Game.DIM_Y - 80];
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
    this.updateScore();
    this.checkGameOver();
  }

  updateScore() {
    let currScore = Math.floor(Game.DIM_Y - this.avatar[0].pos[1] - 80);
    if ( currScore > this.score) {
      this.score = currScore;
    }
  }
}

Game.DIM_X = 600;
Game.DIM_Y = 11745;

module.exports = Game;
