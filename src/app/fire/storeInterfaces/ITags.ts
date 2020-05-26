import { IStoreDocument } from './IStoreDocument';
import { DocumentReference } from '@angular/fire/firestore';
import { from } from 'rxjs';


/**
 * 科目
 *
 * @export
 * @interface ISubject
 */
export interface ISubject {
  id: string;
  name: string;
}

/**
 * 教科
 * 科目の集合
 * @export
 * @interface ISubjectArea
 */
export interface ISubjectArea {
  id: string;


  /**
   * 教科名
   *
   * @type {string}
   * @memberof ISubjectArea
   */
  name: string;

  /**
   * 科目
   *
   * @type {ISubject[]}
   * @memberof ISubjectArea
   */
  subjects: ISubject[];
}



/**
 * 教科の集合
 *
 * @export
 * @interface ISubjectAreas
 * @extends {IStoreDocument}
 */
export interface ISubjectAreas extends IStoreDocument {
  // author: string;
  // published: boolean;


  /**
   * 教科
   *
   * @type {ISubjectArea[]}
   * @memberof ISubjectAreas
   */
  subjectArea: ISubjectArea[];
}



/**
 * 教科ドキュメントの参照ドキュメント
 *
 * @export
 * @interface IUserTagDocument
 * @extends {IStoreDocument}
 */
export interface IUserTagDocument extends IStoreDocument {
  subjectAreas: DocumentReference;
}

