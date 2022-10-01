import {Rect} from './Rect';

export abstract class Drawable {
  public x = 0;
  public y = 0;
  public z = 0;

  public visibility = true;

  private parentComponent: Drawable | null = null;

  abstract draw(): void;
  abstract get width(): number;
  abstract get height(): number;

  get context(): CanvasRenderingContext2D | null {
    return this.parentComponent?.context ?? null;
  }

  get screen(): Drawable | null {
    return this.parentComponent?.screen ?? null;
  }

  get parent() {
    return this.parentComponent;
  }

  set parent(p: Drawable | null) {
    this.parentComponent = p;
  }

  get deltaTime(): number {
    return this.screen?.deltaTime ?? 0;
  }

  getRect(): Rect {
    const parentRect = this.parentComponent
      ? this.parentComponent.getRect()
      : { top: 0, left: 0, bottom: 0, right: 0 };

    return {
      left: parentRect.left + this.x,
      top: parentRect.top + this.y,
      right: parentRect.left + this.x + this.width,
      bottom: parentRect.top + this.y + this.height
    }
  }

  intersectionTest(drawable?: Drawable | null): boolean {
    if (!drawable) return false;

    const r1 = this.getRect();
    const r2 = drawable.getRect();

    return (
      r1.left < r2.right &&
      r1.right > r2.left &&
      r1.top < r2.bottom &&
      r1.bottom > r2.top
    );
  };
}