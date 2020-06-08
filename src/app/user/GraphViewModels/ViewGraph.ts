import { Point2D } from './Point2D';
import { ViewCore } from './ViewCore';
import { DrawBox } from './DrawBox';
import { IWorkResult } from '../../fire/storeInterfaces/IWork';

import { from } from 'rxjs';

export class ViewGraph extends ViewCore {

  // tslint:disable-next-line: variable-name
  private _drawBox: DrawBox = null;

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
    const endDay = Math.ceil(viewmsec / 1000 / 60 / 60 / 24);

    this.startDate = startDate;
    this.endDate = endDate;

    this._range = new Point2D(endDay * 2.71828, viewPoint * 1.15);
  }

  convertDateNumberToDrawX(dateNumber: number): number {
    const date = new Date(dateNumber);
    return this.convertDateToDrawX(date);
  }


  convertDateToDrawX(date: Date): number {
    const viewmsec = date.getTime() - this.startDate.getTime();
    const day = Math.ceil(viewmsec / 1000 / 60 / 60 / 24);
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
      return (diff > 2);
    }
    else {
      return false;
    }
  }

  getDrawRealForgetCurve(allResult: IWorkResult[], result: IWorkResult): string {
    const index = allResult.indexOf(result);
    if (index > 0) {
      const s = allResult[index - 1];
      const e = result;

      const x = this.convertDateNumberToDrawX(s.date);
      const y = this.convertToDrawY(1);
      const y0 = this.convertToDrawY(0);

      const ymax = y0 - y;
      const ex = this.convertDateNumberToDrawX(e.date);
      const ey = this.convertToDrawY(e.rate);

      // const rate = this.convertToDrawX(1000 * 24 * 60 * 60);
      const t = ex - x;
      const alfa = - t / Math.log(1 - (y0 - ey) / ymax); // -t / Math.log(1 - e.rate);

      const dx = ymax * Math.exp(-t / alfa) / alfa;
      const dx2 = x - ex;
      const dy2 = dx2 * dx;

      const y2 = ey + dy2;
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
}
