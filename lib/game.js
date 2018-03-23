const Avatar = require('./avatar');

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
