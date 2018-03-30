const Game = require('./game');
const GameView = require('./game_view');
const Avatar = require('./avatar');
const ModalManager = require('./modal');

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementById("game-canvas");
  const game = new Game();

  const muteButton = document.getElementById("sound-button");
  muteButton.addEventListener("click", function() {
    muteButton.innerHTML = (muteButton.innerHTML == '<i class="material-icons">volume_off</i>') ?
    '<i class="material-icons">volume_up</i>' : '<i class="material-icons">volume_off</i>'
    game.toggleSound();
  });
  window.game = game;
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const gv = new GameView({ game, ctx })
  gv.start();
});
