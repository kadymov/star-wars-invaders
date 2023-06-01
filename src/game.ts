import {Loader} from './engine/Loader';
import {GameScreen} from "./game/GameScreen";

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

  const gameScreen = new GameScreen(images);
  gameScreen.appendTo(document.body);
});
