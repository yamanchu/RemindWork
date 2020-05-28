import { AUserDocumentManagerBase } from './AUserDocumentManagerBase';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { ISubjectAreas, ISubjectArea, ISubject, IUserTagDocument } from '../storeInterfaces/ITags';
import { IStoreDocument } from '../storeInterfaces/IStoreDocument';
import { firestore } from 'firebase';


export class TagDocumentManager extends AUserDocumentManagerBase<ISubjectAreas> {

  constructor(angularFireStore: AngularFirestore) {
    super(angularFireStore);
  }

  protected get defaultCollectionName(): string {
    return 'subjectAreas';
  }

  protected get defaultDocumentionName(): string {
    return '';
  }


  /**
   * subjectAreasコレクションにuserドキュメントを追加する
   *
   * @param {string} userID
   * @param {ISubjectArea} value
   * @returns {Promise<DocumentReference>}
   * @memberof TagDocumentManager
   */
  AddInitiaCustom(userID: string, value: ISubjectArea): Promise<DocumentReference> {
    return this.angularFireStore
      .collection(this.defaultCollectionName)
      .add({
        author: userID,
        published: false,
        subjectArea: [value],
      });
  }

  /**
   *
   *
   * @param {IUserTagDocument} docRef
   * @param {ISubjectArea} removeItem
   * @memberof TagDocumentManager
   */
  RemoveCustom(docRef: IUserTagDocument, removeItem: ISubjectArea) {
    if (docRef != null &&
      docRef.subjectAreas != null) {
      docRef.subjectAreas.update({
        subjectArea: firestore.FieldValue.arrayRemove(removeItem)
      });
    }
  }

  AddCustom(docRef: IUserTagDocument, value: ISubjectArea) {
    if (docRef != null &&
      docRef.subjectAreas != null) {
      docRef.subjectAreas.update({
        subjectArea: firestore.FieldValue.arrayUnion(value)
      });
    }
  }

  AddCustomSubject(docRef: DocumentReference, value: ISubjectArea[]) {
    if (docRef != null &&
      docRef != null) {
      docRef.set({
        subjectArea: value
      }
      );
    }
  }

  CreateUserDocument(userID: string, docRef: DocumentReference): IUserTagDocument {
    return {
      author: userID,
      published: false,
      subjectAreas: docRef
    };
  }
}
