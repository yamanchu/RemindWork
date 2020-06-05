import { IPoint2D } from './IPoint2D';
import { from } from 'rxjs';

export class Point2D implements IPoint2D {
  x: number;
  y: number;

  constructor(valueX: number, valueY: number) {
    this.x = valueX;
    this.y = valueY;
  }

  get text() {
    const ret = this.x.toString() + ' ' + this.y.toString();
    return ret;
  }
}
