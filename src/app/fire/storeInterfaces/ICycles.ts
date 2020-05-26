import { IStoreDocument } from './IStoreDocument';
import { DocumentReference } from '@angular/fire/firestore';
import { from } from 'rxjs';


/**
 * 復習間隔
 *
 * @export
 * @interface IIntarvalNode
 */
export interface IIntarvalNode {
  day: number;
  margin: number;
  repeat: number;
}


/**
 * 復習サイクル
 * 間隔の集合に名前を付けたもの
 * @export
 * @interface ICycleNode
 */
export interface ICycleNode {
  id: string;
  name: string;
  description: string;
  intarval: IIntarvalNode[];
}

/**
 * 復習サイクルの集合
 *
 * @export
 * @interface ICycles
 * @extends {IStoreDocument}
 */
export interface ICycles extends IStoreDocument {
  // author: string;
  // published: boolean;
  cycle: ICycleNode[];
}


/**
 * 復習サイクルの参照ドキュメント
 *
 * @export
 * @interface IUserCycleDocument
 * @extends {IStoreDocument}
 */
export interface IUserCycleDocument extends IStoreDocument {
  cycles: DocumentReference;
}
