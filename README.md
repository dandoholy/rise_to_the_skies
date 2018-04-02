# CREDITS
* Sprites found at: https://www.deviantart.com/art/Icy-Tower-Character-257354681

# LIVE LINK
* https://github.com/dandoholy/rise_to_the_skies

# TECHNOLOGIES
* JavaScript
* HTML and CSS
* HTML Canvas

# INSTRUCTIONS
* Use L/R arrow keys to move character
* Use Space to Jump
* Press Enter at any time to reset game
* Platforms disappear one at a time as time goes on.  Don't fall to your death.

# FEATURES AND CHALLENGES
```javascript
start() {
  this.lastTimestamp = 0;
  requestAnimationFrame(this.animate.bind(this));
  // ...
}
animate(timestamp) {
  this.timeDelta += timestamp - this.lastTimestamp;
  this.lastTimestamp = timestamp;
  while (this.timeDelta >= this.timeStep) {
    this.game.tick(this.timeStep/1000, this.fps);
    this.timeDelta -= this.timeStep;
  }
  this.game.draw(this.ctx);
  this.game.requestId = requestAnimationFrame(this.animate.bind(this));
  // ...
}
```
* Rise to the Skies uses the requestAnimationFrame function built into
modern browsers in order to maintain a consistent refresh rate that makes
for a more enjoyable experience.  The game is also updated with specific
tick intervals to maintain more consistent position updating of the avatar.

```html
<div class='' id='canvas-wrapper' style='height: 700px; width: 600px; overflow: hidden; border: 1px solid black;'>
  <canvas id="game-canvas"  style=""></canvas>
</div>
```
```javascript
scrollBackground() {
  this.canvasWrapper.scrollTop = this.avatar[0].pos[1]-300;
}
```
* The game is rendered using HTML Canvas.  The entire background image
is rendered with platforms drawn onto it with styling set to overflow: hidden
which only shows the 600x700 pixels that the game should.  In order to move
the background, the built in scrollTop feature was used to center the
canvas to the avatar's position.

```javascript
setTickRate() {
  this.ticksPerRemoval = 500000;
  if (this.time < 40 && this.score > 500) {
    this.ticksPerRemoval = 180;
  }
  else if (this.time < 80 && this.score > 500) {
    this.ticksPerRemoval = 90;
  }
  else if (this.time < 120 && this.score > 500) {
    this.ticksPerRemoval = 60;
  }
}
tick(timeDelta, fps) {
  // ...
  this.setTickRate();
  // ...
  this.tickCount += 1;
  if (this.tickCount > this.ticksPerRemoval) {
    this.tickCount = 0;
    this.removePlatform();
  }
}
```
* As the game updated roughly 60 times per second, tick rates were used
to determine the rate at which platforms were removed.  tickCount was incremented
with each call of tick by GameView and platforms were removed when it
reached a certain threshold.  This simplified the removal of platforms at
regular intervals without having to deal with the millisecond count and
finding appropriate values of x for which (time % x) evaluated to every ~1-3 seconds.

# FUTURE FEATURES
* High Scores

# SCREENSHOTS
<img src="https://media.giphy.com/media/87dCA5GkaOuJUEB8Uw/giphy.gif" width="180" height="210" />
* Build up speed to jump even higher!
<img src="https://media.giphy.com/media/9xyJ0cl7bLIZXuDAV7/giphy.gif" width="180" height="210" />
* Platforms are removed as time progresses.  Avoid falling to your death!
