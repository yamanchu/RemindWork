export class Angle {

  // tslint:disable-next-line: variable-name
  private _rad: number;

  constructor() {
    this._rad = 0;
  }

  static CreateFromDeg(deg: number): Angle {
    const ret = new Angle();
    ret._rad = deg * Math.PI / 180.0;
    return ret;
  }

  static CreateFromRad(rad: number): Angle {
    const ret = new Angle();
    ret._rad = rad;
    return ret;
  }

  static Asin(value: number): Angle {
    const rad = Math.asin(value);
    const ret = Angle.CreateFromRad(rad);
    return ret;
  }

  static Acos(value: number): Angle {
    const rad = Math.acos(value);
    const ret = Angle.CreateFromRad(rad);
    return ret;
  }

  static Atan(y: number, x?: number): Angle {
    if (x == null) {
      const rad = Math.atan(y);
      const ret = Angle.CreateFromRad(rad);
      return ret;
    }
    else {
      const rad = Math.atan2(y, x);
      const ret = Angle.CreateFromRad(rad);
      return ret;
    }
  }

  get rad(): number {
    return this._rad;
  }

  SameAs(other: Angle): boolean {
    return (this._rad === other._rad);
  }

  GetNegative(): Angle {
    return Angle.CreateFromRad(-this._rad);
  }

  deg(): number {
    return 180.0 * this.rad / Math.PI;
  }

  sin(): number {
    return Math.sin(this.rad);
  }
  cos(): number {
    return Math.cos(this.rad);
  }
  tan(): number {
    return Math.tan(this.rad);
  }
}
