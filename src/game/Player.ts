import {Movie} from '../engine/Movie';

export class Player extends Movie{
  private speed = 0;
  public accelerationLeft = 0;
  public accelerationRight = 0;

  constructor(
    images: HTMLImageElement[],
    private maxSpeed = 20,
    private minX = -100,
    private maxX = 1024 + 100
  ) {
    super(images, 60);
  }

  draw(x = 0, y = 0) {
    this.update();
    super.draw();
  }

  private update() {
    const accelerationValue =
        this.accelerationRight -
        this.accelerationLeft;

    const a_speed = accelerationValue / 1000;
    let p_speed = this.speed;
    let p_x = this.x;
    const t = this.deltaTime;
    const dVal = a_speed * t;
    let resist = 0;

    if (p_speed < 0)
      resist = -10 / 1000 * t;
    else if (p_speed > 0) {
      resist = 10 / 1000 * t;
    }

    p_speed += dVal - resist;

    if (Math.abs(p_speed) < 0.1) {
      p_speed = 0;
    } else if (Math.abs(p_speed) > this.maxSpeed) {
      p_speed = p_speed < 0 ? - this.maxSpeed : this.maxSpeed;
    }

    p_x += p_speed;


    if (p_x < this.minX) {
      p_x = this.maxX;
    } else if (p_x > this.maxX) {
      p_x = this.minX;
    }

    this.speed = p_speed;
    this.x = p_x;
  }

  fire() {
    this.play(true);
    return this;
  };
}