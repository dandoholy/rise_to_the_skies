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
