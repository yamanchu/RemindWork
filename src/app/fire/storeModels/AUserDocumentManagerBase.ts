import { AUserDocumentManagerCore } from './AUserDocumentManagerCore';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';

export abstract class AUserDocumentManagerBase<T> extends AUserDocumentManagerCore {

  constructor(angularFireStore: AngularFirestore) {
    super(angularFireStore);
  }

  Load(docRef: DocumentReference, observer: ((readValue: T) => void)) {
    if (docRef != null) {
      docRef
        .get()
        .then(
          snapshot => {
            if (snapshot.exists) {
              const value = snapshot.data() as T;
              observer(value);
            }
          });
    }
  }

  protected abstract get defaultCollectionName(): string;

  protected abstract get defaultDocumentionName(): string;

  GetDefault(
    observer: ((readValue: T) => void)
  ) {
    if (this.defaultCollectionName !== '' && this.defaultDocumentionName !== '') {
      this.angularFireStore
        .collection(this.defaultCollectionName)
        .doc(this.defaultDocumentionName)
        .get()
        .subscribe(
          doc => {
            const read = doc.data() as T;
            observer(read);
          });
    }
  }

}
