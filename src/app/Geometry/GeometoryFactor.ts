import { IGeometoryFactor, IVector } from './IGeometoryFactor';
import { AlgebraicUtil } from './AlgebraicUtil';
import { Angle } from './Angle';

export abstract class GeometoryFactor implements IGeometoryFactor {
  // tslint:disable-next-line: variable-name
  protected _x: number;
  // tslint:disable-next-line: variable-name
  protected _y: number;
  // tslint:disable-next-line: variable-name
  protected _z: number;

  constructor() { }

  SameAs(other: IGeometoryFactor) {
    if (AlgebraicUtil.limitEqual(this.x, other.x) &&
      AlgebraicUtil.limitEqual(this.y, other.y) &&
      AlgebraicUtil.limitEqual(this.z, other.z)) {
      return true;
    }
    return false;
  }

  RotX(angle: Angle) {
    const tempY = this.y;
    const tempZ = this.z;

    this._y = angle.cos() * tempY - angle.sin() * tempZ;
    this._z = angle.sin() * tempY + angle.cos() * tempZ;
  }

  RotY(angle: Angle) {
    const tempX = this._x;
    const tempZ = this._z;

    this._x = angle.cos() * tempX + angle.sin() * tempZ;
    this._z = -angle.sin() * tempX + angle.cos() * tempZ;
  }

  RotZ(angle: Angle) {
    const tempX = this._x;
    const tempY = this._y;

    this._x = angle.cos() * tempX - angle.sin() * tempY;
    this._y = angle.sin() * tempX + angle.cos() * tempY;
  }

  Rot(angle: Angle, vec: IVector) {
    const sin = angle.sin();
    const cos = angle.cos();

    const Mcons = 1 - cos;

    const vx = vec.x;
    const vy = vec.y;
    const vz = vec.z;

    const xx = vx * vx;
    const yy = vy * vy;
    const zz = vz * vz;

    const xy = vx * vy;
    const xz = vx * vz;
    const yz = vy * vz;

    const xsin = vx * sin;
    const ysin = vy * sin;
    const zsin = vz * sin;

    const xyMcons = xy * Mcons;
    const xzMcons = xz * Mcons;
    const yzMcons = yz * Mcons;

    const XXconf = (xx + (1 - xx) * cos);
    const XYconf = (xyMcons - zsin);
    const XZconf = (xzMcons + ysin);

    const YXconf = (xyMcons + zsin);
    const YYconf = (yy + (1 - yy) * cos);
    const YZconf = (yzMcons - xsin);

    const ZXconf = (xzMcons - ysin);
    const ZYconf = (yzMcons + xsin);
    const ZZconf = (zz + (1 - zz) * cos);

    const tempX = this.x;
    const tempY = this.y;
    const tempZ = this.z;

    this._x =
      XXconf * tempX +
      XYconf * tempY +
      XZconf * tempZ;

    this._y =
      YXconf * tempX +
      YYconf * tempY +
      YZconf * tempZ;

    this._z =
      ZXconf * tempX +
      ZYconf * tempY +
      ZZconf * tempZ;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get z(): number {
    return this._z;
  }
}
