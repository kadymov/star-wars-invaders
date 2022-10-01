import {Drawable} from './Drawable';

export class Sprite extends Drawable {
  protected images: HTMLImageElement[] = [];
  protected currentFrame = 0;

  constructor(images: HTMLImageElement[]) {
    super();
    this.images = images;
  }

  draw(): void {
    if (!this.visibility) return;
    const img = this.images[this.currentFrame];
    this.context?.drawImage(img, (this.parent?.x ?? 0) + this.x, (this.parent?.y ?? 0) + this.y);
  }

  get frames() {
    return this.images.length;
  }

  get width(): number {
    const img = this.images[this.currentFrame];
    if (!img) return 0;
    return img.width;
  }

  get height(): number {
    const img = this.images[this.currentFrame];
    if (!img) return 0;
    return img.height;
  }

  addImage(image: HTMLImageElement) {
    this.images.push(image);
  }

  goto(id: number) {
    if (id >= 0 && id < this.frames) {
      this.currentFrame = id;
    }
  }

  next() {
    this.currentFrame = this.currentFrame + 1 < this.frames
      ? this.currentFrame + 1
      : 0;
  }

  prev() {
    this.currentFrame = this.currentFrame - 1 >= 0
      ? this.currentFrame - 1
      : this.frames - 1;
  }
}