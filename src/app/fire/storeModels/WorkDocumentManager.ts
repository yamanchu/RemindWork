import { IWork, IWorkResult } from '../storeInterfaces/IWork';
import { AUserDocumentManagerCore } from './AUserDocumentManagerCore';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { firestore } from 'firebase';

export class WorkDocumentManager extends AUserDocumentManagerCore {
  docRef: Map<IWork, DocumentReference>;
  docRefFinished: Map<IWork, DocumentReference>;

  constructor(angularFireStore: AngularFirestore) {
    super(angularFireStore);
    this.docRef = new Map<IWork, DocumentReference>();
    this.docRefFinished = new Map<IWork, DocumentReference>();
  }

  protected get defaultCollectionName(): string {
    return 'works';
  }


  AddWork(value: IWork) {
    if (!this.docRef.has(value)) {
      this.angularFireStore
        .collection(this.defaultCollectionName)
        .add(value).then(item => this.docRef.set(value, item));
    }
    else {
      this.docRef.get(value).update(value);
    }
  }

  Load(
    userID: string,
    toDayTime: number,
    observer: ((readValue: IWork) => void)
  ): any[] {

    const retArray = new Array(0);
    if (this.defaultCollectionName !== null) {

      if (this.docRef.size > 0) {
        this.docRef.clear();
      }

      const ret1 = this.angularFireStore
        .collection(
          this.defaultCollectionName,
          ref => (
            ref.where('author', '==', userID).where('next', '<=', toDayTime).orderBy('next')
          )
        )
        .get()
        .subscribe(
          snapshot => {
            if (!snapshot.empty) {
              snapshot.forEach(doc => {
                const value = doc.data() as IWork;
                observer(value);
                if (!this.docRef.has(value)) {
                  this.docRef.set(value, doc.ref);
                }
              });
            }
          });

      const ret2 = this.angularFireStore
        .collection(
          this.defaultCollectionName,
          ref => (
            ref.where('author', '==', userID).where('upDate', '>', toDayTime).orderBy('upDate')
          )
        )
        .get()
        .subscribe(
          snapshot => {
            if (!snapshot.empty) {
              snapshot.forEach(doc => {
                const value = doc.data() as IWork;
                observer(value);
                if (!this.docRef.has(value)) {
                  this.docRef.set(value, doc.ref);
                }
              });
            }
          });

      retArray.push(ret1);
      retArray.push(ret2);
    }
    return retArray;
  }

  LoadAll(
    userID: string,
    toDayTime: number,
    observer: ((readValue: IWork) => void)
  ): any[] {

    const retArray = new Array(0);
    if (this.defaultCollectionName !== null) {

      if (this.docRefFinished.size > 0) {
        this.docRefFinished.clear();
      }

      const ret1 = this.angularFireStore
        .collection(
          this.defaultCollectionName,
          ref => (
            ref.where('author', '==', userID).where('next', '>', toDayTime)
          )
        )
        .get()
        .subscribe(
          snapshot => {
            if (!snapshot.empty) {
              snapshot.forEach(doc => {
                const value = doc.data() as IWork;
                observer(value);
                if (!this.docRefFinished.has(value)) {
                  this.docRefFinished.set(value, doc.ref);
                }
              });
            }
          });

      /*
  const ret2 = this.angularFireStore
    .collection(
      this.defaultCollectionName,
      ref => (
        ref.where('author', '==', userID).where('upDate', '>', toDayTime).orderBy('upDate')
      )
    )
    .get()
    .subscribe(
      snapshot => {
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            const value = doc.data() as IWork;
            observer(value);
            if (!this.docRef.has(value)) {
              this.docRef.set(value, doc.ref);
            }
          });
        }
      });
*/
      retArray.push(ret1);
      // retArray.push(ret2);
    }
    return retArray;
  }
}
