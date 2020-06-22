import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { promise } from 'protractor';
import { firestore } from 'firebase';
import { ICycles, ICycleNode, IUserCycleDocument } from './storeInterfaces/ICycles';
import { IStoreDocument } from './storeInterfaces/IStoreDocument';
import { CycleDocumentManager } from './storeModels/CycleDocumentManager';
import { TagDocumentManager } from './storeModels/TagDocumentManager';
import { from } from 'rxjs';
import { ISubjectAreas, ISubjectArea, ISubject, IUserTagDocument } from './storeInterfaces/ITags';
import { WorkDocumentManager } from './storeModels/WorkDocumentManager';
import { IWork, IWorkResult } from '../fire/storeInterfaces/IWork';

/*
export class IntarvalNode implements IIntarvalNode {
  day: number;
  margin: number;
  repeat: number;
}
*/



/*
export class CycleNode implements ICycleNode {
  name: string;
  description: string;
  intarval: IntarvalNode[];
}
*/



export interface UserDocument extends IStoreDocument, IUserCycleDocument, IUserTagDocument {
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private angularFireStore: AngularFirestore) {
    if (this.cycleManager == null) {
      this.cycleManager = new CycleDocumentManager(angularFireStore);
    }
    if (this.tagManager == null) {
      this.tagManager = new TagDocumentManager(angularFireStore);
    }
    if (this.workManager == null) {
      this.workManager = new WorkDocumentManager(angularFireStore);
    }
  }
  private userDocumentReference: DocumentReference;
  private userDocument: UserDocument = null;
  private cycleManager: CycleDocumentManager;
  private tagManager: TagDocumentManager;
  private workManager: WorkDocumentManager;

  loadDatas: any[];

  waitingLoadAllhWork = false;
  LoadAllhWork(
    userID: string,
    toDayTime: number,
    workObserver: ((work: IWork) => void)) {
    Promise.all(this.loadDatas).then((ret) => {
      const wait1 = this.workManager.LoadAll(userID, toDayTime, workObserver);
    });
  }

  Load(
    userID: string,
    toDayTime: number,
    cycleObserver: ((cycles: ICycles) => void),
    tagObserver: ((subjectAreas: ISubjectAreas) => void),
    workObserver: ((work: IWork) => void),
    readFinishObserver: (() => void)
  ) {
    this.loadDatas = new Array(0);

    const wait0 = this.GetDefaultCycles(cycleObserver);
    const wait1 = this.workManager.Load(userID, toDayTime, workObserver);

    this.loadDatas.push(wait0);
    this.loadDatas.push(wait1);

    const wait4 = this.angularFireStore
      .collection('users', ref => ref.where('author', '==', userID))
      .get()
      .subscribe(
        snapshot => {
          if (!snapshot.empty) {
            this.userDocumentReference = snapshot.docs[0].ref;
            this.userDocument = snapshot.docs[0].data() as UserDocument;
            const wait2 = this.cycleManager.Load(this.userDocument.cycles, cycleObserver);
            const wait3 = this.tagManager.Load(this.userDocument.subjectAreas, tagObserver);
            // this.loadDatas.push(wait2);
            // this.loadDatas.push(wait3);
            Promise.all([wait0, wait1, wait2, wait3]).then((ret) => {
              readFinishObserver();
            });
          }
        });
    this.loadDatas.push(wait4);
  }


  /* 複数の処理を待ち受けるサンプルとして残しておく
  private CreateUserDocument(userID: string) {

    this.userDocumentReference = {
      cycles: null,
    };

    this.angularFireStore
      .collection('users')
      .doc(userID)
      .set(this.userDocumentReference);
      .then(() => {
        this.cycles = null;
      });


  const results = [];

  const newCycle = {
    cycle: []
  };

  results.push(
    this.angularFireStore
      .collection('cycles')
      .add(newCycle));
/*
  Promise.all(results).then((ret) => {

    const c = ret[0] as DocumentReference;
    const data = {
      cycles: c,
    };
    this.angularFireStore
      .collection('users')
      .doc(userID)
      .set(data)
      .then(() => {
        this.CreatedUserData = true;
      });
  });

}
*/
  GetDefaultCycles(
    observer: ((cycles: ICycles) => void)
  ): any {
    return this.cycleManager.GetDefault(observer);
  }


  RemoveCustomCycle(value: ICycleNode) {
    if (this.userDocument != null) {
      this.cycleManager.RemoveCustom(this.userDocument, value);
    }
  }

  AddSubjectArea(userID: string, value: ISubjectArea[]) {
    this.tagManager.AddCustomSubjectArea(userID, this.userDocument.subjectAreas, value);
  }

  AddSubjectAres(userID: string, value: ISubjectArea) {
    if (this.userDocument == null ||
      this.userDocument.subjectAreas == null) {
      this.tagManager.AddInitiaCustom(userID, value)
        .then(
          docRef => { // docRef:作られたuserドキュメント
            if (this.userDocument == null) {
              const userDoc = this.tagManager.CreateUserDocument(userID, docRef);
              this.userDocument = {
                author: userDoc.author,
                published: userDoc.published,
                cycles: null,
                subjectAreas: docRef,
              };
              this.angularFireStore
                .collection('users')
                .add(this.userDocument)　// usersコレクションにUserDocumentを追加
                .then(
                  doc => {
                    this.userDocumentReference = doc;　// 追加されたUserDocumentの参照を保持
                  });
            }
            else {
              this.userDocument.subjectAreas = docRef;
              this.userDocumentReference.set({
                subjectAreas: docRef
              }, { merge: true });
            }
          }).catch(reason => {
            console.log(reason);
          });
    }
    else {
      this.tagManager.AddCustom(this.userDocument, value);
    }
  }


  AddCustomCycle(userID: string, value: ICycleNode) {
    if (this.userDocument == null ||
      this.userDocument.cycles == null) {

      this.cycleManager.AddInitiaCustom(userID, value)// cyclesコレクションにuserドキュメントを追加する
        .then(
          docRef => { // docRef:作られたuserドキュメント
            // this.userDocument = this.cycleManager.CreateUserDocument(userID, docRef); // cycleドキュメントの参照を保持するUserDocumentを生成
            if (this.userDocument == null) {
              const userDoc = this.cycleManager.CreateUserDocument(userID, docRef);
              this.userDocument = {
                author: userDoc.author,
                published: userDoc.published,
                cycles: docRef,
                subjectAreas: null,
              };
              this.angularFireStore
                .collection('users')
                .add(this.userDocument)　// usersコレクションにUserDocumentを追加
                .then(
                  doc => {
                    this.userDocumentReference = doc;　// 追加されたUserDocumentの参照を保持
                  });
            }
            else {
              this.userDocument.cycles = docRef;
              this.userDocumentReference.set({
                cycles: docRef
              }, { merge: true });
            }
          }).catch(reason => {
            console.log(reason);
          });
    }
    else {
      this.cycleManager.AddCustom(this.userDocument, value);
    }

    /*
    this.angularFireStore
      .collection('users').doc(id)
      .collection('custom').doc('Cycles')
      .add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });*/
  }

  AddWork(value: IWork) {
    this.workManager.AddWork(value);
  }

  /*GetWork(
    userID: string,
    observer: ((readValue: IWork) => void)
  ) {
    this.workManager.GetWork(userID, observer);
  }*/
}
