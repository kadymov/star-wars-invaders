import {Drawable} from './Drawable';

export class Caption extends Drawable{
  constructor(
    public text: string,
    public color: string,
    public align: CanvasTextAlign,
    public font?: string,
    public textBaseline?: CanvasTextBaseline
  ) {
    super();
  }

  draw(): void {
    if (!this.visibility || !this.context) return;

    this.context.save();
    this.context.fillStyle = this.color;
    this.context.font = this.font ?? '';
    this.context.textAlign = this.align;
    this.context.textBaseline = this.textBaseline ?? 'top';
    this.context.fillText(this.text, (this.parent?.x ?? 0) + this.x, (this.parent?.y ?? 0) + this.y);
    this.context.restore();
  }

  get width() {
    return 0; // TODO
  }

  get height() {
    return 0; // TODO
  }
}