export class AlgebraicUtil {

  // tslint:disable-next-line: variable-name
  private static _limitDisit = Math.pow(10, -11);

  static limitEqual(value: number, realValue: number): boolean {
    if ((realValue < value + this._limitDisit) && (realValue > value - this._limitDisit)) {
      return true;
    }
    return false;
  }

  static limitEqualZero(value: number): boolean {
    const realValue = 0;
    if ((realValue < value + this._limitDisit) && (realValue > value - this._limitDisit)) {
      return true;
    }
    return false;
  }
}
