import {Layer} from './Layer';
import {Drawable} from 'src/engine/Drawable';

export class Screen extends Layer {
  public showFPC: boolean;
  private readonly canvas: HTMLCanvasElement;
  private lastDraw: number;
  private lastFpcUpd: number;
  private fpc = 0;
  private readonly ctx: CanvasRenderingContext2D | null;

  constructor(width: number, height: number, showFPC = false) {
    super();

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = this.canvas.getContext('2d');

    this.showFPC = showFPC;
    this.lastDraw = new Date().getTime();
    this.lastFpcUpd = new Date().getTime();
  }

  appendTo(container: HTMLElement) {
    container.appendChild(this.canvas);
    return this;
  }

  draw() {
    this.context?.fillRect(0, 0, this.width, this.height);

    for (const child of this.children) {
      child.draw();
    }

    if (this.showFPC) {
      this.drawFpc();
    }

    this.lastDraw = new Date().getTime();
  }

  get deltaTime(): number {
    return new Date().getTime() - this.lastDraw;
  }

  drawFpc(): void {
    if (!this.context) return;

    const now = new Date().getTime();
    const delta = (now - this.lastDraw) / 1000;

    if ((now - this.lastFpcUpd > 500)) {
      this.lastFpcUpd = now;
      this.fpc = Math.round(1 / delta);
    }

    this.context.save();
    this.context.fillStyle = '#ffffff';
    this.context.font      = '12pt Arial';
    this.context.textBaseline = 'top';
    this.context.fillText('FPC: ' + this.fpc, 10, 10);
    this.context.restore();
  }

  get context(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  get screen(): Drawable {
    return this;
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }
}