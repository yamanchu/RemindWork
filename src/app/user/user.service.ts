import { Injectable, IterableDiffers } from '@angular/core';
import { Router } from '@angular/router';

/* service */
import { AuthService } from '../fire/auth.service';
import { StoreService } from '../fire/store.service';
import { ICycles, ICycleNode } from '../fire/storeInterfaces/ICycles';
import { ISubjectAreas, ISubjectArea, ISubject } from '../fire/storeInterfaces/ITags';
import { IWork, IWorkResult } from '../fire/storeInterfaces/IWork';
import { ViewGraph } from './GraphViewModels/ViewGraph';
import { environment } from 'src/environments/environment';

import { interval, from } from 'rxjs';
import { strict } from 'assert';
import { database } from 'firebase';
import { Point2D } from './GraphViewModels/Point2D';


export interface ICycleNodeViewModel {
  data: ICycleNode;
  isCustomNode: boolean;
  openView: boolean;
}

export interface ISubjectAreaNodeViewModel {
  data: ISubjectArea;
}

/**
 *
 *
 * @export
 * @interface IWorkNodeViewModel
 */
export interface IWorkNodeViewModel {
  data: IWork;
  subjectArea: ISubjectArea;
  subject: ISubject[];
  // toDayFinished: boolean;
  next: Date;
  last: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router,
    private auth: AuthService,
    private store: StoreService) { }

  private initialized = false;

  today: Date;

  // tslint:disable-next-line: variable-name
  private _subjectAreaNodeViewModel: ISubjectAreaNodeViewModel[] = null;

  get subjectAreaNodeViewModel(): ISubjectAreaNodeViewModel[] {
    if (this._subjectAreaNodeViewModel == null) {
      this._subjectAreaNodeViewModel = new Array(0);
    }
    return this._subjectAreaNodeViewModel;
  }

  // tslint:disable-next-line: variable-name
  private _cycleNodeViewModel: ICycleNodeViewModel[] = null;

  get cycleNodeViewModel(): ICycleNodeViewModel[] {
    if (this._cycleNodeViewModel == null) {
      this._cycleNodeViewModel = new Array(0);
    }
    return this._cycleNodeViewModel;
  }

  // tslint:disable-next-line: variable-name
  private _workTarget: IWorkNodeViewModel[] = null;

  get workTarget(): IWorkNodeViewModel[] {
    if (this._workTarget == null) {
      this._workTarget = new Array(0);
    }
    return this._workTarget;
  }

  // tslint:disable-next-line: variable-name
  private _workAll: IWorkNodeViewModel[] = null;

  get workAll(): IWorkNodeViewModel[] {
    if (this._workAll == null) {
      this._workAll = new Array(0);
    }
    return this._workAll;
  }

  // tslint:disable-next-line: variable-name
  private _viewGraph: Map<IWorkNodeViewModel, ViewGraph> = null;


  GetView(workNodeViewModel: IWorkNodeViewModel): ViewGraph {
    if (this._viewGraph == null) {
      this._viewGraph = new Map<IWorkNodeViewModel, ViewGraph>();
    }

    if (!this._viewGraph.has(workNodeViewModel)) {
      const startDay = new Date(workNodeViewModel.data.registrationDate);
      const endDay = new Date(workNodeViewModel.data.next);
      const today = new Date();

      let viewDate = endDay;
      if (endDay < today) {
        viewDate = today;
      }
      const viewmsec = viewDate.getTime() - startDay.getTime();
      const checkDay = viewmsec / 1000 / 60 / 60 / 24;
      const viewDay = Math.ceil(checkDay);

      const viewPoint = workNodeViewModel.data.maxPoint;
      const graph = new ViewGraph(viewDate, viewDay, viewPoint);
      this._viewGraph.set(workNodeViewModel, graph);
    }

    return this._viewGraph.get(workNodeViewModel);
  }

  routerNavigate(command: string) {
    this.router.navigate([command]);
  }

  get hasLoginUser(): boolean {
    if (this.auth.hasLoginUser) {
      return true;
    }
  }

  googleLogin(command: string) {
    this.auth.googleLogin(command, this.router);
  }

  private setCycleNodeViewModel(cycles: ICycles): void {

    for (const iterator of cycles.cycle) {
      this.cycleNodeViewModel.push(
        {
          data: iterator,
          isCustomNode: !cycles.published,
          openView: false,
        });
    }
  }

  private setSubjectAreaViewModel(subjectAreas: ISubjectAreas): void {

    for (const iterator of subjectAreas.subjectArea) {
      this.subjectAreaNodeViewModel.push(
        {
          data: iterator,
        });
    }
  }

  private setWorkViewModel(work: IWork): void {

    /*
    let subjectArea: ISubjectArea = null;
    const subjectAreaIndex = this.subjectAreaNodeViewModel.findIndex(item => item.data.id === work.subjectAreaID);
    if (subjectAreaIndex >= 0) {
      subjectArea = this.subjectAreaNodeViewModel[subjectAreaIndex].data;
    }

    const subject: ISubject[] = new Array(0);
    if (subjectArea != null) {
      for (const iterator of work.subjectID) {
        const subjectIndex = subjectArea.subjects.findIndex(item => item.id === iterator);
        if (subjectIndex >= 0) {
          subject.push(subjectArea.subjects[subjectIndex]);
        }
      }
    }
*/
    const workNodeViewModel: IWorkNodeViewModel = {
      data: work,
      subjectArea: null,
      subject: null,
      // toDayFinished: false,
      next: new Date(work.next),
      last: new Date(work.result[work.result.length - 1].date),
    };

    this.workAll.push(workNodeViewModel);
    if (workNodeViewModel.next < this.today || !environment.production) {
      this.workTarget.push(workNodeViewModel);
    }
  }

  private readFinish() {
    for (const workNodeViewModel of this.workAll) {

      const work = workNodeViewModel.data;

      let subjectArea: ISubjectArea = null;
      const subjectAreaIndex = this.subjectAreaNodeViewModel.findIndex(item => item.data.id === work.subjectAreaID);
      if (subjectAreaIndex >= 0) {
        subjectArea = this.subjectAreaNodeViewModel[subjectAreaIndex].data;
      }

      const subject: ISubject[] = new Array(0);
      if (subjectArea != null) {
        for (const iterator of work.subjectID) {
          const subjectIndex = subjectArea.subjects.findIndex(item => item.id === iterator);
          if (subjectIndex >= 0) {
            subject.push(subjectArea.subjects[subjectIndex]);
          }
        }
      }

      workNodeViewModel.subjectArea = subjectArea;
      workNodeViewModel.subject = subject;
    }
  }

  LoadData() {

    // const current = new Date();
    this.today = new Date();

    if (!this.initialized) {
      this.store.GetDefaultCycles((cycles) => this.setCycleNodeViewModel(cycles));

      const uid = this.auth.TryGetUID();
      this.store.Load(uid,
        (cycles) => this.setCycleNodeViewModel(cycles),
        (subjectAreas) => this.setSubjectAreaViewModel(subjectAreas),
        (work) => this.setWorkViewModel(work),
        () => this.readFinish());

      this.initialized = true;
    }
    else {
      this.workTarget.slice(0);
      for (const iterator of this.workAll) {
        if (iterator.next > this.today) {
          this.workTarget.push(iterator);
        }
      }
    }
  }

  AddSubject(subjectAreaName: string, inputSubject: ISubject[]): ISubjectArea {
    let ret: ISubjectArea = null;

    const index = this.subjectAreaNodeViewModel.findIndex(item => item.data.name === subjectAreaName);
    const add: ISubject[] = new Array(0);
    if (index >= 0) {// 既存の教科が入力された
      ret = this.subjectAreaNodeViewModel[index].data;
      const subjects = ret.subjects;
      for (const iterator of inputSubject) {
        const i = subjects.findIndex(item => item.id === iterator.id);
        if (i < 0) {
          const n: ISubject = {
            id: iterator.id,
            name: iterator.name,
          };
          add.push(n);
          ret.subjects.push(n);
        }
      }
      if (add.length > 0) {
        const result: ISubjectArea[] = new Array(0);
        for (const iterator of this.subjectAreaNodeViewModel) {
          result.push(iterator.data);
        }
        const id = this.auth.TryGetUID();
        this.store.AddSubjectArea(id, result);
        // this.store.AddSubject(add, index);
      }
    }
    return ret;
  }

  AddSubjectAres(value: ISubjectArea) {
    const id = this.auth.TryGetUID();
    this.store.AddSubjectAres(id, value);

    this.subjectAreaNodeViewModel.push(
      {
        data: value,
      });
  }

  AddCustomCycle(value: ICycleNode) {
    const id = this.auth.TryGetUID();
    this.store.AddCustomCycle(id, value);

    this.cycleNodeViewModel.push(
      {
        data: value,
        isCustomNode: true,
        openView: true,
      });
  }

  DeleteCustomCycle(id: string) {
    const index = this.cycleNodeViewModel.findIndex(node => node.data.id === id);

    if (index >= 0) {
      if (this.cycleNodeViewModel[index].isCustomNode) {
        this.store.RemoveCustomCycle(this.cycleNodeViewModel[index].data);
        this.cycleNodeViewModel.splice(index, 1);
      }
    }
  }

  DeleteCustomSubjectArea(values: ISubjectArea[]) {
    if (values.length > 0) {

      for (const iterator of values) {
        const i = this.subjectAreaNodeViewModel.findIndex(item => item.data === iterator);
        this.subjectAreaNodeViewModel.splice(i, 1);
      }

      const newSubjectArea: ISubjectArea[] = new Array(0);
      for (const iterator of this.subjectAreaNodeViewModel) {
        newSubjectArea.push(iterator.data);
      }
      const id = this.auth.TryGetUID();
      this.store.AddSubjectArea(id, newSubjectArea);
    }
  }

  DeleteCustomSubject(subjectAreaNodeViewModel: ISubjectAreaNodeViewModel, subjects: ISubject[]) {

    if ((subjectAreaNodeViewModel != null) &&
      (subjects.length > 0)) {

      for (const iterator of subjects) {
        const delIndex = subjectAreaNodeViewModel.data.subjects.indexOf(iterator);
        if (delIndex >= 0) {
          subjectAreaNodeViewModel.data.subjects.splice(delIndex, 1);
        }
      }

      const newSubjectArea: ISubjectArea[] = new Array(0);
      for (const iterator of this.subjectAreaNodeViewModel) {
        newSubjectArea.push(iterator.data);
      }
      const id = this.auth.TryGetUID();
      this.store.AddSubjectArea(id, newSubjectArea);
    }
  }

  AddWork(
    cycleNodeViewModel: ICycleNodeViewModel,
    inputSubjects: ISubject[],
    subjectArea: ISubjectArea,
    newID: string,
    overviewData: string,
    memoData: string,
    maxPointData: number): IWorkNodeViewModel {
    const work = this.GetWorkData(cycleNodeViewModel, inputSubjects, subjectArea, newID, overviewData, memoData, maxPointData);
    this.store.AddWork(work);

    return {
      data: work,
      subjectArea,
      subject: inputSubjects,
      // toDayFinished: true,
      next: new Date(work.next),
      last: new Date(work.result[work.result.length - 1].date),
    };
  }

  private GetWorkData(
    cycleNodeViewModel: ICycleNodeViewModel,
    inputSubjects: ISubject[],
    subjectArea: ISubjectArea,
    newID: string,
    overviewData: string,
    memoData: string,
    maxPointData: number): IWork {
    const newRegistorDataID = newID;
    const newRegistorDataCycle = cycleNodeViewModel;
    const subjectIDs: string[] = new Array(0);
    for (const iterator of inputSubjects) {
      subjectIDs.push(iterator.id);
    }
    const intarval = newRegistorDataCycle.data.intarval[0];
    let randomDay = Math.ceil(intarval.day
      + (Math.random() - 1.0) * 2.0 * intarval.margin);
    if (randomDay < 1) {
      randomDay = intarval.day;
    }

    const refreshTime = 4;
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);
    now.setHours(refreshTime);
    now.setDate(now.getDate());
    if (now.getHours() < refreshTime) {
      now.setDate(now.getDate() - 1);
    }
    const nextDate = new Date();
    nextDate.setMilliseconds(0);
    nextDate.setSeconds(0);
    nextDate.setMinutes(0);
    nextDate.setHours(refreshTime);
    nextDate.setDate(now.getDate() + randomDay);
    // const nextDate = new Date(now.setDate(now.getDate() + randomDay));
    const uid = this.auth.TryGetUID();
    const registorData: IWork = {
      author: uid,
      published: false,
      id: newRegistorDataID,
      cycleID: newRegistorDataCycle.data.id,
      overview: overviewData,
      memo: memoData,
      maxPoint: maxPointData,
      subjectAreaID: subjectArea.id,
      subjectID: subjectIDs,
      registrationDate: new Date().toString(),
      next: nextDate.toString(),
      result: [{
        date: now.toString(),
        rate: 0,
      }],
      resultOffset: 0,
    };
    return registorData;
  }

  /*GetWork(observer: ((readValue: IWork) => void)
  ) {
    const userID = this.auth.TryGetUID();
    this.store.GetWork(userID, observer);
  }*/
}
