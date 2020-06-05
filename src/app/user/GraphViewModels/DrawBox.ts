import { Point2D } from './Point2D';
import { from } from 'rxjs';

export class DrawBox {
  start: Point2D;
  end: Point2D;

  constructor() { }

  get size(): Point2D {
    const ret = new Point2D(
      this.end.x - this.start.x,
      this.end.y - this.start.y);

    return ret;
  }

  get area() {
    return this.start.text + ' ' + this.size.text;
  }
}
