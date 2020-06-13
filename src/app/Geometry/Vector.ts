import { IVector } from './IGeometoryFactor';
import { AlgebraicUtil } from './AlgebraicUtil';
import { GeometoryFactor } from './GeometoryFactor';
import { Angle } from './Angle';

export class Vector extends GeometoryFactor implements IVector {

  // tslint:disable-next-line: variable-name
  private _isUnit = false;

  constructor() { super(); }

  static UnitX(): Vector {
    const ret = new Vector();
    ret._x = 1.0;
    ret._y = 0.0;
    ret._z = 0.0;
    ret._isUnit = true;
    return ret;
  }

  static UnitY(): Vector {
    const ret = new Vector();
    ret._x = 0.0;
    ret._y = 1.0;
    ret._z = 0.0;
    ret._isUnit = true;
    return ret;
  }

  static UnitZ(): Vector {
    const ret = new Vector();
    ret._x = 0.0;
    ret._y = 0.0;
    ret._z = 1.0;
    ret._isUnit = true;
    return ret;
  }


  static Create(x: number, y: number, z: number): Vector {
    const ret = new Vector();
    ret._x = x;
    ret._y = y;
    ret._z = z;
    ret._isUnit = false;
    return ret;
  }


  CreateAngle(vb: Vector): Angle {
    const Va = this.Clone();
    const Vb = vb.Clone();

    if (Va.TryNormalization() && Vb.TryNormalization()) {
      if (
        AlgebraicUtil.limitEqual(Va.x, Vb.x) &&
        AlgebraicUtil.limitEqual(Va.y, Vb.y) &&
        AlgebraicUtil.limitEqual(Va.z, Vb.z)) {
        return Angle.CreateFromDeg(0);
      }
      else if (
        AlgebraicUtil.limitEqual(Va.x, -Vb.x) &&
        AlgebraicUtil.limitEqual(Va.y, -Vb.y) &&
        AlgebraicUtil.limitEqual(Va.z, -Vb.z)) {
        return Angle.CreateFromDeg(180);
      }
      else {
        const angle = Va.x * Vb.x + Va.y * Vb.y + Va.z * Vb.z;

        if (angle == null) {
          const v = Vector.Create(Va.x + Vb.x, Va.y + Vb.y, Va.z + Vb.z);
          if (AlgebraicUtil.limitEqualZero(v.GetLength())) {
            return Angle.CreateFromDeg(0);
          }
          else {
            return Angle.CreateFromDeg(180);
          }
        }
        else {
          return Angle.Acos(angle);
        }
      }
    }
    else {
      return Angle.CreateFromDeg(0);
    }
  }

  FaceToFace(other: Vector): boolean {
    const angle = this.CreateAngle(other);
    if (AlgebraicUtil.limitEqualZero(angle.rad)) {
      return false;
    }
    else {
      if (angle.deg() < 90) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  Clone(): Vector {
    const ret = new Vector();
    ret._x = this.x;
    ret._y = this.y;
    ret._z = this.z;
    ret._isUnit = this.isUnit();
    return ret;
  }

  Opposite() {
    this._x = -this.x;
    this._y = -this.y;
    this._z = -this.z;
  }

  SetRate(rate: number) {
    this._x = this.x * rate;
    this._y = this.y * rate;
    this._z = this.z * rate;
    this._isUnit = false;
  }

  SetOuter(va: Vector, vb: Vector) {
    this._isUnit = false;
    this._x = va.y * vb.z - va.z * vb.y;
    this._y = va.z * vb.x - va.x * vb.z;
    this._z = va.x * vb.y - va.y * vb.x;
  }

  TryNormalization(): boolean {
    if (!this.isUnit()) {
      const l = this.DeNormalLength();
      if (AlgebraicUtil.limitEqualZero(l)) {
        return false;
      }
      const nx = this.x / l;
      const ny = this.y / l;
      const nz = this.z / l;
      this._x = nx;
      this._y = ny;
      this._z = nz;
      this._isUnit = true;
    }
    return true;
  }

  isUnit(): boolean {
    return this._isUnit;
  }

  isParallel(other: Vector): boolean {
    const a = this.Clone();
    const b = other.Clone();
    if (a.TryNormalization() && b.TryNormalization()) {
      const i = Math.abs(a.Inner(b));
      return AlgebraicUtil.limitEqual(i, 1);
    }
    return false;
  }

  isRight(other: Vector): boolean {
    const a = this.Clone();
    const b = other.Clone();
    if (a.TryNormalization() && b.TryNormalization()) {
      const i = Math.abs(a.Inner(b));
      return AlgebraicUtil.limitEqualZero(i);
    }
    return false;
  }

  Inner(v: Vector): number {
    const ret = this.x * v.x + this.y * v.y + this.z * v.z;
    return ret;
  }

  GetLength() {
    if (this.isUnit()) {
      return 1;
    }
    else {
      return this.DeNormalLength();
    }
  }

  private DeNormalLength(): number {
    let dx = 0;
    let dy = 0;
    let dz = 0;

    if (this.x !== 0 && this.x !== 1 && this.x !== -1) {
      dx = this.x * this.x;
    }
    else if (this.x === 1 || this.x === -1) {
      dx = 1;
    }

    if (this.y !== 0 && this.y !== 1 && this.y !== -1) {
      dy = this.y * this.y;
    }
    else if (this.y === 1 || this.y === -1) {
      dy = 1;
    }

    if (this.z !== 0 && this.z !== 1 && this.z !== -1) {
      dz = this.z * this.z;
    }
    else if (this.z === 1 || this.z === -1) {
      dz = 1;
    }

    if (dx === 1 && dy === 0 && dz === 0) {
      this._isUnit = true;
      return 1;
    }
    else if (dx === 0 && dy === 1 && dz === 0) {
      this._isUnit = true;
      return 1;
    }
    else if (dx === 0 && dy === 0 && dz === 1) {
      this._isUnit = true;
      return 1;
    }
    else {
      const d = Math.sqrt(dx + dy + dz);
      if (AlgebraicUtil.limitEqual(d, 1)) {
        this._isUnit = true;
        return 1;
      }
      return d;
    }
  }

  TrySetNormalVector(va: Vector, vb: Vector): boolean {
    this.SetOuter(va, vb);
    return this.TryNormalization();
  }
}
