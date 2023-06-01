import {Layer} from '../engine/Layer';
import {Movie} from '../engine/Movie';

export class EnemiesLayer extends Layer {
  public level = 1;
  private moveDirection: 'left' | 'right' = 'right';
  private hSpeed = 100;
  private vSpeed = 15;
  private readonly eventsCallback: (e: { event: string }) => void;

  constructor(enemySprite: ImageBitmap[], cb: EnemiesLayer['eventsCallback']) {
    super();
    this.eventsCallback = cb;
    this.init(enemySprite);
  }

  private init(enemySprite: ImageBitmap[]) {
    const H_SPACE = 40;
    const V_SPACE = 40;

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < 6; i++) {
        const enemy = new Movie(enemySprite, 20, false);
        this.add(enemy, i * H_SPACE, j * V_SPACE);
      }
    }
  }

  public draw() {
    if (!this.visibility || !this.screen) return this;

    const hVal = this.hSpeed * this.level / 1000 * this.deltaTime;
    const vVal = this.vSpeed * this.level / 1000 * this.deltaTime;

    if (this.x < 0) {
      this.moveDirection = 'right';
    } else if (this.x > this.screen.width - this.width) {
      this.moveDirection = 'left';
    }

    this.x += this.moveDirection === 'right' ? hVal : -hVal;
    this.y += vVal;

    if (this.y + this.height >= this.screen.height - 120) {
      this.eventsCallback({event : 'gameover'});
    }

    super.draw();
  }
}