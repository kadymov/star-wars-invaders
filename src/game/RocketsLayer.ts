import {Layer} from '../engine/Layer';
import {Rocket} from './Rocket';
import {EnemiesLayer} from './EnemiesLayer';
import {Player} from './Player';
import {Drawable} from 'src/engine/Drawable';

export class RocketsLayer extends Layer {
  private rocketsBuffer: Rocket[] = [];
  private enemiesLayer: EnemiesLayer;
  private player: Player;
  private lastEnemiesShot: number;
  private readonly eventsCallback: (e: { event: string }) => void;

  constructor(
    rocketSprite: HTMLImageElement[],
    bufferSize: number,
    enemiesLayer: EnemiesLayer,
    player: Player,
    eventsCallback: RocketsLayer['eventsCallback']
  ) {
    super();

    this.enemiesLayer = enemiesLayer;
    this.player = player;
    this.lastEnemiesShot = new Date().getTime();
    this.eventsCallback = eventsCallback;

    this.init(rocketSprite, bufferSize);
  }

  private init(rocketSprite: HTMLImageElement[], bufferSize: number) {
    const buff = this.rocketsBuffer;

    for (let i = 0; i < bufferSize; i++) {
      ((i) => {
        buff.push(new Rocket(rocketSprite, 0, -20,
          this.onDestroy.bind(this, i))
        );
      })(i);
    }
  }

  checkCollision(rocket: Drawable) {
    const enemies = this.enemiesLayer.children;

    for (const enemy of enemies) {
      if (enemy.intersectionTest(rocket)) {
        return enemy;
      }
    }
  }

  draw(x: number = 0, y: number = 0) {
    if (!this.visibility) return this;

    for (const rocket of this.children) {
      const target = this.checkCollision(rocket);

      if (target) {
        this.enemiesLayer.remove(target);
        this.remove(rocket);

        this.eventsCallback({event : 'enemyDestroyed'});

        if (!this.enemiesLayer.children.length) {
          this.eventsCallback({event : 'won'});
        }
      }

      if (this.player.intersectionTest(rocket)) {
        this.eventsCallback({event : 'damage'});
        this.remove(rocket);
      }
    }

    this.enemiesShot();

    super.draw();
  }

  private onDestroy(i: number) {
    const rocket = this.rocketsBuffer[i];
    this.remove(rocket);
    rocket.x = 0;
    rocket.y = this.screen?.height ?? 0;
  }

  public launch(x: number, y: number, enemyShot = false) {
    const buffer = this.rocketsBuffer;

    for (const rocket of buffer) {
      if (!this.has(rocket)) {
        rocket.speedY = enemyShot ? 5 : -20;

        this.add(rocket, x - rocket.width / 2, y);

        rocket.launch();
        break;
      }
    }
  }

  private enemiesShot() {
    if (
      new Date().getTime() -
      this.lastEnemiesShot < 2000
    ) return;

    this.launch(this.player.x + this.player.width / 2,
      this.enemiesLayer.getRect().bottom, true);

    this.lastEnemiesShot = new Date().getTime();
  }
}