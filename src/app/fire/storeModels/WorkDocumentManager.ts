import { IWork, IWorkResult } from '../storeInterfaces/IWork';
import { AUserDocumentManagerCore } from './AUserDocumentManagerCore';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { firestore } from 'firebase';

export class WorkDocumentManager extends AUserDocumentManagerCore {

  constructor(angularFireStore: AngularFirestore) {
    super(angularFireStore);
  }

  protected get defaultCollectionName(): string {
    return 'works';
  }


  AddWork(value: IWork): Promise<DocumentReference> {
    return this.angularFireStore
      .collection(this.defaultCollectionName)
      .add(value);
  }

  Load(
    userID: string,
    toDayTime: number,
    observer: ((readValue: IWork) => void)
  ): any {
    if (this.defaultCollectionName !== null) {

      const worksRef = this.angularFireStore.collection(this.defaultCollectionName);

      return this.angularFireStore
        .collection(
          this.defaultCollectionName,
          ref => (
            ref.where('author', '==', userID).where('upDate', '>', toDayTime).orderBy('upDate', 'desc') ||
            ref.where('author', '==', userID).where('upDate', '<=', toDayTime).orderBy('upDate', 'desc').where('next', '<=', toDayTime)
          )
        )
        .get()
        .subscribe(
          snapshot => {
            if (!snapshot.empty) {
              snapshot.forEach(doc => {
                const value = doc.data() as IWork;
                observer(value);
              });
            }
          });
    }
  }

}
