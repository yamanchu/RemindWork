import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

export abstract class AUserDocumentManagerCore {

  constructor(
    angularFireStore: AngularFirestore) {
    this.angularFireStore = angularFireStore;
  }

  angularFireStore: AngularFirestore;
}
