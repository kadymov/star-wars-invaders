import {Drawable} from './Drawable';

export class Layer extends Drawable {
  public children: Drawable[] = [];

  constructor() {
    super();
  }

  draw() {
    if (!this.visibility) return;

    for (const child of this.children) {
      if (child) {
        child.draw();
      }
    }
  }

  clear(): void {
    this.children = [];
  }

  add(child: Drawable, x?: number, y?: number, z?: number) {
    this.children.push(child);

    child.parent = this;

    if (x !== undefined) child.x = x;
    if (y !== undefined) child.y = y;

    if (z !== undefined) {
      child.z = z;
      this.children = this.children.sort((a, b) =>  a.z - b.z);
    }

    return this;
  }

  remove(child: Drawable): boolean {
    const id = this.children.indexOf(child);

    if (id >= 0) {
      this.children.splice(id, 1);
      return true;
    }

    return false;
  }

  has(child: Drawable) {
    return this.children.includes(child)
  }

  get width(): number {
    let maxVal = 0;

    for (const child of this.children) {
      const val = child.x + child.width;
      if (maxVal < val) maxVal = val;
    }

    return maxVal;
  }

  get height(): number {
    let maxVal = 0;

    for (const child of this.children) {
      const val = child.y + child.height;
      if (maxVal < val) maxVal = val;
    }

    return maxVal;
  }
}