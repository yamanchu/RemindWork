import { Point2D } from './Point2D';
import { DrawBox } from './DrawBox';

export abstract class ViewCore {

  constructor() {
  }

  // tslint:disable-next-line: variable-name
  protected _range: Point2D;


  abstract get drawBax(): DrawBox;

  abstract get viewOutline(): DrawBox;

  protected get rnage() { return this._range; }

  convertToDrawX(objectValue: number): number {
    const ret = this.viewOutline.start.x +
      objectValue * (this.viewOutline.size.x / this.rnage.x);
    return ret;
  }

  convertToDrawY(objectValue: number): number {
    const ret = this.viewOutline.start.y +
      objectValue * (this.viewOutline.size.y / this.rnage.y);
    return ret;
  }
}
