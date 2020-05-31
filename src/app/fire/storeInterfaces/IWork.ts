
/**
 * 学習データ
 *
 * @export
 * @interface IWork
 */
export interface IWork {
  id: string;


  /**
   * サイクルID
   *
   * @type {string}
   * @memberof IWork
   */
  cycleID: string;

  /**
   * 概要
   *
   * @type {string}
   * @memberof IWork
   */
  overview: string;

  memo: string;

  maxPoint: number;

  subjectAreaID: string;

  subjectID: string[];

  /**
   * 登録日
   *
   * @type {Date}
   * @memberof IWork
   */
  registrationDate: Date;

  /**
   * 次回学習日
   *
   * @type {Date}
   * @memberof IWork
   */
  next: Date;

  /**
   * 学習結果
   *
   * @type {IWorkResult[]}
   * @memberof IWork
   */
  result: IWorkResult[];

  /**
   * 学習結果のlenghtとcycleの関係をoffsetする。
   * 繰返しの延長や巻き戻しに用いる
   * @type {number}
   * @memberof IWork
   */
  resultOffset: number;
}


/**
 * 学習結果データ
 *
 * @export
 * @interface IWorkResult
 */
export interface IWorkResult {


  /**
   * 復習日
   *
   * @type {Date}
   * @memberof IWorkResult
   */
  date: Date;


  /**
   * 正答率
   *
   * @type {number}
   * @memberof IWorkResult
   */
  rate: number;
}
