import {Sprite} from '../engine/Sprite';

export class Rocket extends Sprite {
  public speedX = 0;
  public speedY = 0;
  private launched = false;
  private readonly onDestroy: () => void;

  constructor(images: HTMLImageElement[], speedX: number, speedY: number, onDestroy: Rocket['onDestroy']) {
    super(images);

    this.speedX = speedX;
    this.speedY = speedY;
    this.onDestroy = onDestroy;
  }

  private update() {
    if (!this.launched) return;

    this.x = this.x + this.speedX;
    this.y = this.y + this.speedY;

    if (!this.intersectionTest(this.screen)) {
      this.onDestroy();
    }
  }

  public draw() {
    this.update();
    super.draw();
  }

  public launch() {
    this.launched = true;
  }
}