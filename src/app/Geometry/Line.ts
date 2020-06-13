import { AlgebraicUtil } from './AlgebraicUtil';
import { Vector } from './Vector';
import { Point } from './Point';
import { Angle } from './Angle';

export class Line {
  // tslint:disable-next-line: variable-name
  private _p: Point;
  // tslint:disable-next-line: variable-name
  private _v: Vector;

  constructor() {
  }


  static Create(p: Point, v: Vector): Line {
    const ret = new Line();
    ret._p = p;
    ret._v = v;
    return ret;
  }

  SameAs(other: Line) {
    if (this.p.SameAs(other.p) &&
      this.v.SameAs(other.v)) {
      return true;
    }
    return false;
  }

  RotX(angle: Angle) {
    this.p.RotX(angle);
    this.v.RotX(angle);
  }

  RotY(angle: Angle) {
    this.p.RotY(angle);
    this.v.RotY(angle);
  }

  RotZ(angle: Angle) {
    this.p.RotZ(angle);
    this.v.RotZ(angle);
  }

  Rot(angle: Angle, vec: Vector) {
    this.p.Rot(angle, vec);
    this.v.Rot(angle, vec);
  }

  Move(dx: number, dy: number, dz: number) {
    this.p.Move(dx, dy, dz);
  }

  MoveVec(d: Vector) {
    this.p.MoveVec(d);
  }

  Clone(): Line {
    const ret = new Line();
    ret._p = this.p.Clone();
    ret._v = this.v.Clone();
    return ret;
  }

  LengthLine(other: Line): number {
    // http://tgws.fromc.jp/ul/ul31.html#3-1

    if (this._p.SameAs(other._p)) {
      return 0;
    }
    else {
      const D = this.p.CreateVector(other.p);
      const N = new Vector(); // 面の法線ベクトル
      let L = 0;
      if (N.TrySetNormalVector(this.v, other.v)) {
        L = Math.abs(N.Inner(D));
      }
      else {
        // 線同士が平行
        // http://www.deqnotes.net/acmicpc/2d_geometry/products
        N.SetOuter(this.v, D);
        L = N.GetLength();
      }
      if (AlgebraicUtil.limitEqualZero(L)) {
        return 0;
      }
      else {
        return L;
      }
    }
  }

  CrossCheck(other: Line): boolean {
    if (this._v.isParallel(other._v)) {
      return false;
    }
    else {
      const l = this.LengthLine(other);
      return AlgebraicUtil.limitEqualZero(l);
    }
  }

  LengthPoint(other: Point): number {
    let ret = 0.0;
    if (!this._p.SameAs(other)) {
      const v = this.p.CreateVector(other);
      const lv = new Vector();
      lv.SetOuter(this.v, v);
      const l = lv.GetLength();
      if (!AlgebraicUtil.limitEqualZero(l)) {
        ret = l;
      }
      return ret;
    }
  }

  /// <summary>
  /// 点を取得
  /// </summary>
  /// <param name="t"></param>
  /// <returns></returns>
  OnPoint(t: number): Point {
    const ret = this._p.Clone();
    const move = this._v.Clone();
    move.SetRate(t);
    ret.MoveVec(move);
    return ret;
  }

  TryGetCrossPoints(other: Line): Point {

    if (!this.v.isUnit ||
      !other.v.isUnit ||
      this.SameAs(other)) {
      return null;
    }
    else {
      const l = this.LengthLine(other);
      const cross = AlgebraicUtil.limitEqualZero(l);

      if (!cross) // 交わらない
      {
        return null;
      }
      else {
        const Pa = this.p.Clone();
        const Pb = other.p.Clone();

        const Da1Length = other.LengthPoint(Pa);
        const Db1Length = this.LengthPoint(Pb);

        if (!AlgebraicUtil.limitEqualZero(Da1Length) && !AlgebraicUtil.limitEqualZero(Db1Length)) {
          const PbPaVector = Pb.CreateVector(Pa);
          const PbPaNormalVector = new Vector();
          const Da1 = new Vector();
          if (PbPaNormalVector.TrySetNormalVector(other.v, PbPaVector) && Da1.TrySetNormalVector(other.v, PbPaNormalVector)) {
            Da1.SetRate(Da1Length);
            const t = (Db1Length + Da1Length) / 2;
            const Pa2 = this.OnPoint(t);

            const PbPa2Vector = other.p.CreateVector(Pa2);

            const Pa2VLength = other.LengthPoint(Pa2);

            const PbPa2NormalVector = new Vector();
            const Pa2V = new Vector();
            if (PbPa2NormalVector.TrySetNormalVector(other.v, PbPa2Vector) && Pa2V.TrySetNormalVector(other.v, PbPa2NormalVector)) {
              Pa2V.SetRate(Pa2VLength);

              const Da3 = Vector.Create(Da1.x - Pa2V.x, Da1.y - Pa2V.y, Da1.z - Pa2V.z);

              const Da3Length = Da3.GetLength();
              if (!AlgebraicUtil.limitEqualZero(Da3Length)) {
                let Ta1 = t * Da1Length / Da3Length;
                if (Da1.FaceToFace(Da3)) {
                  Ta1 = -Ta1;
                }

                return this.OnPoint(Ta1);
              }
              else {
                return null;
              }
            }
            else {
              return Pa2;
            }
          }
          else {
            return null;
          }
        }
        else if (AlgebraicUtil.limitEqualZero(Da1Length) && !AlgebraicUtil.limitEqualZero(Db1Length))// 基準点が相手の線上に有る
        {
          return Pa;
        }
        else if (!AlgebraicUtil.limitEqualZero(Da1Length) && AlgebraicUtil.limitEqualZero(Db1Length))// 基準点が相手の線上に有る
        {
          return Pb;
        }
        else// 同じ線
        {
          return null;
        }
      }
    }
  }

  get p(): Point {
    return this._p;
  }

  get v(): Vector {
    return this._v;
  }
}

