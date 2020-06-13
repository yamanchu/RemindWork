import { Vector } from './Vector';
import { AlgebraicUtil } from './AlgebraicUtil';
import { GeometoryFactor } from './GeometoryFactor';
import { Angle } from './Angle';

export class Point extends GeometoryFactor {

  constructor() {
    super();
  }

  static Po(): Point {
    const ret = new Point();
    ret._x = 0;
    ret._y = 0;
    ret._z = 0;
    return ret;
  }

  static Create(x: number, y: number, z: number): Point {
    const ret = new Point();
    ret._x = x;
    ret._y = y;
    ret._z = z;
    return ret;
  }

  Length(other: Point): number {
    if (this.SameAs(other)) {
      return 0;
    }
    else {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const dz = this.y - other.z;

      const l = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (AlgebraicUtil.limitEqualZero(l)) {
        return 0;
      }
      else {
        return l;
      }
    }
  }

  Clone(): Point {
    const ret = new Point();
    ret._x = this.x;
    ret._y = this.y;
    ret._z = this.z;
    return ret;
  }

  Move(dx: number, dy: number, dz: number) {
    this._x = this.x + dx;
    this._y = this.y + dy;
    this._z = this.z + dz;
  }

  MoveVec(d: Vector) {
    this.Move(d.x, d.y, d.z);
  }

  CreateVector(end: Point): Vector {
    const ret = Vector.Create(
      end.x - this.x,
      end.y - this.y,
      end.z - this.z);
    return ret;
  }
}
