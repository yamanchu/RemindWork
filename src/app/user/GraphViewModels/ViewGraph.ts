import { Point2D } from './Point2D';
import { ViewCore } from './ViewCore';
import { DrawBox } from './DrawBox';

export class ViewGraph extends ViewCore {

  // tslint:disable-next-line: variable-name
  private _drawBox: DrawBox = null;

  // tslint:disable-next-line: variable-name
  private _viewDay: number;

  viewDate: Date;

  get drawBax(): DrawBox {
    if (this._drawBox === null) {
      this._drawBox = new DrawBox();
      this._drawBox.start = new Point2D(-10, -10);
      this._drawBox.end = new Point2D(610, 170);
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

  constructor(viewDate: Date, viewDay: number, viewPoint: number) {
    super(new Point2D(viewDay * 2.5, viewPoint * 1.15));
    this._viewDay = viewDay;
    this.viewDate = viewDate;
  }

  get checkDate(): number {
    const ret = this.convertToDrawX(this._viewDay);
    return ret;
  }

  checkDatePath(): string {
    const startX = this.checkDate;
    const startY = this._viewOutline.start.y;
    const endX = startX;
    const endY = this._viewOutline.end.y;

    const ret = 'M ' + startX.toString() + ' ' + startY.toString() + ' L ' + endX.toString() + ' ' + endY.toString();
    return ret;
  }
}
