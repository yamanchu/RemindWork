import { Point2D } from './Point2D';
import { ViewCore } from './ViewCore';
import { DrawBox } from './DrawBox';
import { IWorkResult } from '../../fire/storeInterfaces/IWork';

import { from } from 'rxjs';
import { Point } from 'src/app/Geometry/Point';
import { Vector } from 'src/app/Geometry/Vector';
import { Line } from 'src/app/Geometry/Line';
import { stat } from 'fs';

export class ViewGraph extends ViewCore {

  // tslint:disable-next-line: variable-name
  private _drawBox: DrawBox = null;
  private marjinPoint = 0.368;

  // tslint:disable-next-line: variable-name
  // private _viewDay: number;

  startDate: Date;
  endDate: Date;

  get drawBax(): DrawBox {
    if (this._drawBox === null) {
      this._drawBox = new DrawBox();
      this._drawBox.start = new Point2D(-10, -10);
      this._drawBox.end = new Point2D(610, 174);
    }
    return this._drawBox;
  }

  // tslint:disable-next-line: variable-name
  private _viewOutline: DrawBox = null;

  get viewOutline(): DrawBox {
    if (this._viewOutline == null) {
      this._viewOutline = new DrawBox();
      this._viewOutline.start = new Point2D(0, 150);
      this._viewOutline.end = new Point2D(600, 0);
    }
    return this._viewOutline;
  }

  pointPath(perfect: number): string {
    const startX = this._viewOutline.start.x;
    const startY = this.convertToDrawY(perfect);
    const endX = this._viewOutline.end.x;
    const endY = this.convertToDrawY(perfect);

    const ret = 'M ' + startX.toString() + ' ' + startY.toString() + ' L ' + endX.toString() + ' ' + endY.toString();
    return ret;
  }

  constructor(startDate: Date, endDate: Date, viewPoint: number) {
    super();

    const viewmsec = endDate.getTime() - startDate.getTime();
    const endDay = Math.floor(viewmsec / 1000 / 60 / 60 / 24);

    this.startDate = startDate;
    this.endDate = endDate;

    this._range = new Point2D(
      Math.floor(endDay * Math.exp(1)),
      viewPoint * 1.15);
  }

  convertDateNumberToDrawX(dateNumber: number): number {
    const date = new Date(dateNumber);
    return this.convertDateToDrawX(date);
  }


  convertDateToDrawX(date: Date): number {
    const viewmsec = date.getTime() - this.startDate.getTime();
    const day = Math.ceil(viewmsec / 1000 / 60 / 60 / 24);
    if (day == null) {
      console.log(day);
    }
    const ret = this.convertToDrawX(day);
    return ret;
  }

  get endDayDrawX(): number {
    return this.convertDateToDrawX(this.endDate);
  }

  endDayDrawPath(): string {
    const startX = this.endDayDrawX;
    const startY = this._viewOutline.start.y;
    const endX = startX;
    const endY = this._viewOutline.end.y;

    const ret = 'M ' + startX.toString() + ' ' + startY.toString() + ' L ' + endX.toString() + ' ' + endY.toString();
    return ret;
  }

  drawRealForgetCurve(allResult: IWorkResult[], result: IWorkResult): boolean {
    const index = allResult.indexOf(result);
    if (index > 0) {
      const before = this.convertDateNumberToDrawX(allResult[index - 1].date);
      const current = this.convertDateNumberToDrawX(allResult[index].date);
      const diff = current - before;
      return (diff > 4);
    }
    else {
      return false;
    }
  }

  private getRealRate(maxPoint: number, allResult: IWorkResult[], result: IWorkResult): number {
    const index = allResult.indexOf(result);
    if (index > 0) {
      const m = this.marjinPoint / index;
      const min = m / (maxPoint + m) / 2;
      const rate = min + (maxPoint * result.rate) / (maxPoint + m);
      return rate;
    }
    else {
      return 0;
    }
  }

  getDrawRealForgetPoint(maxPoint: number, allResult: IWorkResult[], result: IWorkResult): number {
    const rate = this.getRealRate(maxPoint, allResult, result);
    const ey = this.convertToDrawY(rate);
    return ey;
  }

  getDrawRealForgetCurve(maxPoint: number, allResult: IWorkResult[], result: IWorkResult): string {
    const index = allResult.indexOf(result);
    if (index > 0) {

      const rate = this.getRealRate(maxPoint, allResult, result);
      const s = allResult[index - 1];
      const e = result;

      const x = this.convertDateNumberToDrawX(s.date);
      const y = this.convertToDrawY(1);
      const y0 = this.convertToDrawY(0);

      const ymax = y0 - y;
      const ex = this.convertDateNumberToDrawX(e.date);
      const ey = this.convertToDrawY(rate);

      const t = (e.date - s.date) / 1000 / 24 / 60 / 60;
      const alfa = - t / Math.log(1 - rate); // -t / Math.log(1 - e.rate);

      const day1 = this.convertToDrawX(1);
      let dxdy = - Math.exp(-t / alfa) / alfa;
      const mindxdy = -(1 - rate) / t;
      if (dxdy < mindxdy) {
        dxdy = mindxdy;
      }

      const p = Point.Create(t, rate, 0);
      const v = Vector.Create(1, dxdy, 0);
      v.TryNormalization();
      const l = Line.Create(p, v);
      const ly = Line.Create(Point.Po(), Vector.UnitY());
      const cp = ly.TryGetCrossPoints(l);
      const y2 = this.convertToDrawY(cp.y);

      const ret =
        'M ' + x + ' ' + y +
        ' C ' + x + ' ' + y + ', ' +
        x + ' ' + y2 + ', ' +
        ex + ' ' + ey;
      return ret;
    }
    else {
      return '';
    }
    // d="M10 10 C 20 20, 40 20, 50 10"
    // M x y
    // C x1 y1, x2 y2, x y (or c dx1 dy1, dx2 dy2, dx dy)
  }

  getDrawImageForgetCurveFront(allResult: IWorkResult[], next?: number): string {

    if (next == null ||
      next === Number.MAX_SAFE_INTEGER) {
      next = allResult[0].date + this.convertToObjectX(this.viewOutline.end.x) * 1000 * 24 * 60 * 60;
    }

    const count = allResult.length - 1;
    const s = allResult[count];
    // const e = result;

    const z = s.rate;
    const beta = Math.exp(1.25 * count);
    let alfa = 0.64;

    if (count > 0) {
      // const alfac = z; // / 0.000223;
      // const alfam = Math.pow(count, 2.1857);
      // alfa += Math.exp(alfac / alfam);
      alfa += Math.pow(count, 2.1857);
    }

    const t = (next - s.date) / 1000 / 24 / 60 / 60;
    const M = z * Math.exp(-t / beta);
    const Qn = M + (1 - M) * Math.exp(-t / alfa);

    let dxdy =
      -z * Math.exp(-t / beta) / beta
      - Math.exp(-t / alfa) / alfa
      + z * Math.exp(-t * (1 / beta + 1 / alfa)) * (1 / beta + 1 / alfa);

    const mindxdy = -(1 - Qn) / t;
    if (dxdy < mindxdy) {
      dxdy = mindxdy;
    }
    const p = Point.Create(t, Qn, 0);
    const v = Vector.Create(1, dxdy, 0);
    v.TryNormalization();
    const l = Line.Create(p, v);
    const ly = Line.Create(Point.Po(), Vector.UnitY());
    const cp = ly.TryGetCrossPoints(l);
    const x = this.convertDateNumberToDrawX(s.date);
    const y = this.convertToDrawY(1);

    const y2 = this.convertToDrawY(cp.y);
    const ex = this.convertDateNumberToDrawX(next);
    const ey = this.convertToDrawY(Qn);

    const ret =
      'M ' + x + ' ' + y +
      ' C ' + x + ' ' + y + ', ' +
      x + ' ' + y2 + ', ' +
      ex + ' ' + ey;
    return ret;

  }

  getDrawImageForgetCurveRear(allResult: IWorkResult[], next?: number): string {

    if (next == null ||
      next === Number.MAX_SAFE_INTEGER) {
      next = allResult[0].date + this.convertToObjectX(this.viewOutline.end.x) * 1000 * 24 * 60 * 60;
    }

    const count = allResult.length - 1;
    const s = allResult[count];
    // const e = result;

    const z = s.rate;
    const beta = Math.exp(1.25 * count);
    let alfa = 0.64;

    if (count > 0) {
      // const alfac = z; // / 0.000223;
      // const alfam = Math.pow(count, 2.1857);
      // alfa += Math.exp(alfac / alfam);
      alfa += Math.pow(count, 2.1857);
    }

    const t = (next - s.date) / 1000 / 24 / 60 / 60;
    const M = z * Math.exp(-t / beta);
    const Qn = M + (1 - M) * Math.exp(-t / alfa);

    let dxdy =
      -z * Math.exp(-t / beta) / beta
      - Math.exp(-t / alfa) / alfa
      + z * Math.exp(-t * (1 / beta + 1 / alfa)) * (1 / beta + 1 / alfa);

    const mindxdy = -(1 - Qn) / t;
    if (dxdy < mindxdy) {
      dxdy = mindxdy;
    }

    const endDay = this.convertToObjectX(this.viewOutline.end.x);

    const et = endDay;
    const eM = z * Math.exp(-et / beta);
    const eQn = eM + (1 - eM) * Math.exp(-et / alfa);

    const edxdy =
      -z * Math.exp(-et / beta) / beta
      - Math.exp(-et / alfa) / alfa
      + z * Math.exp(-et * (1 / beta + 1 / alfa)) * (1 / beta + 1 / alfa);

    const p = Point.Create(t, Qn, 0);
    const v = Vector.Create(1, dxdy, 0);
    v.TryNormalization();
    const l = Line.Create(p, v);

    const ep = Point.Create(et, eQn, 0);
    const ev = Vector.Create(1, edxdy, 0);
    ev.TryNormalization();
    const ly = Line.Create(ep, ev);
    const cp = ly.TryGetCrossPoints(l);
    const x = this.convertDateNumberToDrawX(next);
    const y = this.convertToDrawY(Qn);

    const x2 = this.convertToDrawX(cp.x) +
      this.convertDateNumberToDrawX(s.date);
    const y2 = this.convertToDrawY(cp.y);
    const ex = this.viewOutline.end.x;
    const ey = this.convertToDrawY(eQn);

    const ret =
      'M ' + x + ' ' + y +
      ' C ' + x2 + ' ' + y2 + ', ' +
      ex + ' ' + ey + ', ' +
      ex + ' ' + ey;

    return ret;
  }
}
