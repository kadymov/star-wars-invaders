import {Sprite} from './Sprite';

export class Movie extends Sprite{
  private frame = 0;
  private duration = 0;
  private lastTime = 0;
  private isPlay = false;
  private once = false;

  constructor(images: HTMLImageElement[], duration = 100, once = false) {
    super(images);
    this.duration = duration;
    this.once = once;
  }

  draw() {
    if (!this.visibility) return;
    const img = this.images[this.currentFrame];
    this.step();
    this.context?.drawImage(img, (this.parent?.x ?? 0) + this.x, (this.parent?.y ?? 0) + this.y);
  };

  step() {
    if (!this.isPlay) return;

    const now = new Date().getTime();
    const dt = now - (this.lastTime || now);
    const f = this.frame + dt / this.duration;

    this.lastTime = now;

    if (this.once && this.currentFrame === this.frames - 1) {
      this.stop();
      this.goto(0);
      return;
    }

    if (f > this.frame) this.next();

    this.frame = f;
  };

  stop(): void {
    this.isPlay = false;
  }

  play(once = false, start?: number) {
    this.isPlay = true;
    this.once = once;
    if (start != undefined) {
      this.goto(start);
    }
  }
}