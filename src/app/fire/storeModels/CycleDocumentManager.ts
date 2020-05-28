import { AUserDocumentManagerBase } from './AUserDocumentManagerBase';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { ICycles, ICycleNode, IUserCycleDocument } from '../storeInterfaces/ICycles';
import { IStoreDocument } from '../storeInterfaces/IStoreDocument';
import { firestore } from 'firebase';

export class CycleDocumentManager extends AUserDocumentManagerBase<ICycles> {

  constructor(angularFireStore: AngularFirestore) {
    super(angularFireStore);
  }

  protected get defaultCollectionName(): string {
    return 'cycles';
  }

  protected get defaultDocumentionName(): string {
    return 'common';
  }

  RemoveCustom(docRef: IUserCycleDocument, value: ICycleNode) {

    if (docRef != null &&
      docRef.cycles != null) {

      docRef.cycles.update({
        cycle: firestore.FieldValue.arrayRemove(value)
      });
    }
  }


  /**
   * cyclesコレクションにuserドキュメントを追加する
   *
   * @param {string} userID
   * @param {ICycleNode} value
   * @returns {Promise<DocumentReference>}
   * @memberof CycleDocumentManager
   */
  AddInitiaCustom(userID: string, value: ICycleNode): Promise<DocumentReference> {

    return this.angularFireStore
      .collection(this.defaultCollectionName)
      .add({
        author: userID,
        published: false,
        cycle: [value],
      });
  }

  AddCustom(docRef: IUserCycleDocument, value: ICycleNode) {

    if (docRef != null &&
      docRef.cycles != null) {
      docRef.cycles.update({
        cycle: firestore.FieldValue.arrayUnion(value)
      });
    }
  }

  // cycleドキュメントの参照を保持するUserDocumentを生成
  CreateUserDocument(userID: string, docRef: DocumentReference): IUserCycleDocument {
    return {
      author: userID,
      published: false,
      cycles: docRef
    };
  }
}
