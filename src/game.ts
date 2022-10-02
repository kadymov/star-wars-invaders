import {ImgResOutput, Loader} from './engine/Loader';
import {Screen} from './engine/Screen';
import {Player} from './game/Player';
import {Sprite} from './engine/Sprite';
import {Layer} from './engine/Layer';
import {Caption} from './engine/Caption';
import {EnemiesLayer} from './game/EnemiesLayer';
import {RocketsLayer} from './game/RocketsLayer';

document.addEventListener('DOMContentLoaded', async function () {
  const images = await Loader.loadImages({
    background: 'img/bg.png',
    overflow: 'img/overflow.png',
    player: ['img/player.png', 'img/player.png', 'img/player.png'],
    enemy: ['img/enemy.png', 'img/enemy.png', 'img/enemy.png'],
    rocket: 'img/rocket.png',
    bunker: 'img/bunker.png',
    bunkerMask: 'img/bunker_mask.png'
  });

  init(images);
});

function init(images: ImgResOutput) {
  const SCR_WIDTH = 405;
  const SCR_HEIGHT = 720;
  let gameIsRunning = true;

  const screen = new Screen(
    SCR_WIDTH,
    SCR_HEIGHT,
    true
  ).appendTo(document.body);

  // Game Elements
  const player = new Player(images.player,
    50, -100, SCR_WIDTH + 100);
  const background = new Sprite(images.background);
  const overflow = new Sprite(images.overflow);

  const livesIcon = new Sprite(images.player);
  const gameStatusCaption = new Caption('You WIN!', 'white', 'center', '20px Arial');
  const numberOfLivesCaption = new Caption('3', 'white', 'start', '16px Arial');

  // Layers
  const playerLayer = new Layer();
  const backgroundLayer = new Layer();
  const enemiesLayer = new EnemiesLayer(images.enemy, onEvent);
  const rocketsLayer = new RocketsLayer(images.rocket,
     20, enemiesLayer, player, onEvent);
  const uiLayer = new Layer();

  let numberOfLives = 3;
  let shakeScreenCount = 0;

  // ----------

  screen.add(backgroundLayer.add(background))
    .add(rocketsLayer)
    .add(playerLayer.add(player,
      SCR_WIDTH / 2 - player.width / 2,
      SCR_HEIGHT - player.height - 80))
    .add(enemiesLayer, 0, 100)
    .add(uiLayer
      .add(livesIcon, 10, screen.height - 60)
      .add(numberOfLivesCaption,
        livesIcon.x + livesIcon.width + 15, livesIcon.y + livesIcon.height / 2 - 5)
      .add(overflow)
      .add(gameStatusCaption, screen.width / 2, screen.height / 2)
    );

  overflow.visibility = false;
  gameStatusCaption.visibility = false;

  // Events -------------------------------------------------------------

  let fire = false;
  document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft') player.accelerationLeft = 50;
    if (e.code === 'ArrowRight') player.accelerationRight = 50;
    if (e.code === 'Space') {
      fire = true;
    }
  });
  document.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowLeft') player.accelerationLeft = 0;
    if (e.code === 'ArrowRight') player.accelerationRight = 0;
    if (e.code === 'Space') {
      fire = false;
    }
  });

  // Render -------------------------------------------------------------

  (function render() {
    if (gameIsRunning) {
      step();
      screen.draw();
    }
    requestAnimationFrame(render);
  })();

  // --------------------------------------------------------------------

  const launch = (function () {
    let lastShot = new Date().getTime();
    return function () {
      if (new Date().getTime() - lastShot < 100) return;

      player.fire();
       rocketsLayer.launch(player.x + player.width / 2,
         player.y - 30);

      lastShot = new Date().getTime();
    }
  })();

  function shakeScreen() {
    if (!shakeScreenCount) {
      screen.x = 0;
      screen.y = 0;
      return;
    }
    shakeScreenCount--;

    screen.x = Math.random() * 20 - 10;
    screen.y = Math.random() * 20 - 10;
  }

  function step() {
    if (fire) launch();
    shakeScreen();
  }

  // Game Events --------------------------------------------------------

  function onEvent(e: { event: string }) {
    switch (e.event) {
      case 'enemyDestroyed':
        enemiesLayer.level = enemiesLayer.level + 0.1;
        break;
      case 'damage':
        numberOfLives--;
        shakeScreenCount = 10;
        numberOfLivesCaption.text = numberOfLives.toString();
        if (!numberOfLives) onEvent({event: 'gameover'});
        break;
      case 'won':
        gameIsRunning = false;
        overflow.visibility = true;
        gameStatusCaption.text = 'You WIN!';
        gameStatusCaption.visibility = true;
        break;
      case 'gameover':
        gameIsRunning = false;
        overflow.visibility = true;
        gameStatusCaption.text = 'Game Over';
        gameStatusCaption.visibility = true;
        break;
    }
  }
}