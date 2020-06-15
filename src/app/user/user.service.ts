import { Injectable, IterableDiffers } from '@angular/core';
import { Router } from '@angular/router';

/* service */
import { AuthService } from '../fire/auth.service';
import { StoreService } from '../fire/store.service';
import { ICycles, ICycleNode, IIntarvalNode } from '../fire/storeInterfaces/ICycles';
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

export enum NextToGo {
  Next, Repeat, ReStart, Finish
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
  memoLink: string[];
  // gotoInterval: IIntarvalNode;
  cycleCount: number;
  cycle: ICycleNode;
  nextToGo: NextToGo;
  isLastWork: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  get debugMode(): boolean {
    return !environment.production;
  }

  private get refreshTime(): number {
    return 4;
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private store: StoreService) { }

  private initialized: Date = null;

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
  /*
  private _workAll: IWorkNodeViewModel[] = null;

  get workAll(): IWorkNodeViewModel[] {
    if (this._workAll == null) {
      this._workAll = new Array(0);
    }
    return this._workAll;
  }
*/

  // tslint:disable-next-line: variable-name
  private _viewGraph: Map<IWorkNodeViewModel, ViewGraph> = null;


  GetView(workNodeViewModel: IWorkNodeViewModel): ViewGraph {
    if (this._viewGraph == null) {
      this._viewGraph = new Map<IWorkNodeViewModel, ViewGraph>();
    }

    if (!this._viewGraph.has(workNodeViewModel)) {
      const startDay = this.GetBaseDate(new Date(workNodeViewModel.data.registrationDate).getDate(), 0);
      const nextDay = new Date(workNodeViewModel.data.next);
      const today = new Date();

      let endDate = nextDay;
      if (nextDay < today) {
        endDate = this.GetBaseDate(today.getDate(), 0);
      }
      const viewmsec = endDate.getTime() - startDay.getTime();
      const checkDay = viewmsec / 1000 / 60 / 60 / 24;

      const graph = new ViewGraph(startDay, endDate, 1);

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

  AutoLink(text: string) {
    const reg = new RegExp('((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))');
    return text.replace(reg, '<a href=\'$1\' target=\'_blank\'>$1</a>');
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

    let memo: string[];
    if (work.memo != null) {
      if (work.memo.indexOf('\n') < 0) {
        memo = [work.memo];
      }
      else {
        memo = work.memo.split('\n');
      }
    }
    else {
      memo = new Array(0);
    }
    let next: Date = null;
    if (work.next != null) {
      next = new Date(work.next);
    }

    const workNodeViewModel: IWorkNodeViewModel = {
      data: work,
      subjectArea: null,
      subject: null,
      // toDayFinished: false,
      next,
      last: new Date(work.result[work.result.length - 1].date),
      memoLink: memo,
      cycleCount: Number.MAX_VALUE, // this.GetGoToInterval(cycle, work.result),
      cycle: null,
      nextToGo: NextToGo.Next,
      isLastWork: false,
    };

    // this.workAll.push(workNodeViewModel);
    if (((workNodeViewModel.next != null) && workNodeViewModel.next <= this.today)
      || (workNodeViewModel.last.getTime() === this.today.getTime())) {
      this.workTarget.push(workNodeViewModel);
    }
  }

  private readFinish() {
    for (const workNodeViewModel of this.workTarget) {

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


      const cycle = this.GetCycleFromWork(work);
      workNodeViewModel.cycleCount = this.GetCycleCount(cycle);
      workNodeViewModel.cycle = cycle;

      const nextInterval = this.GetGoToInterval(cycle, workNodeViewModel.data.result, workNodeViewModel.data.resultOffset);
      workNodeViewModel.isLastWork = (nextInterval == null);
      if (workNodeViewModel.isLastWork) {
        workNodeViewModel.nextToGo = NextToGo.Finish;
      }
    }
  }

  LoadData() {

    // const current = new Date();
    this.today = this.GetBaseDate();

    if (this.initialized == null || this.initialized < this.today) {

      this.cycleNodeViewModel.splice(0);
      this.subjectAreaNodeViewModel.splice(0);
      this.workTarget.splice(0);

      // this.store.GetDefaultCycles((cycles) => this.setCycleNodeViewModel(cycles));

      const uid = this.auth.TryGetUID();
      this.store.Load(uid,
        this.today.getTime(),
        (cycles) => this.setCycleNodeViewModel(cycles),
        (subjectAreas) => this.setSubjectAreaViewModel(subjectAreas),
        (work) => this.setWorkViewModel(work),
        () => this.readFinish());

      this.initialized = this.today;
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

    const cycle = this.GetCycleFromWork(work);

    let memo: string[];
    if (work.memo != null) {
      if (work.memo.indexOf('\n') < 0) {
        memo = [work.memo];
      }
      else {
        memo = work.memo.split('\n');
      }
    }
    else {
      memo = new Array(0);
    }

    return {
      data: work,
      subjectArea,
      subject: inputSubjects,
      // toDayFinished: true,
      next: new Date(work.next),
      last: new Date(work.result[work.result.length - 1].date),
      memoLink: memo,
      cycleCount: this.GetCycleCount(cycle),
      cycle,
      nextToGo: NextToGo.Next,
      isLastWork: false,
    };
  }

  private GetBaseDate(today?: number, offsetDay?: number): Date {
    const base = new Date();
    if (today == null) {
      today = base.getDate();
    }
    if (offsetDay == null) {
      offsetDay = 0;
    }

    base.setDate(today + offsetDay);
    if (base.getHours() < this.refreshTime) {
      base.setDate(base.getDate() - 1);
    }
    base.setHours(this.refreshTime);
    base.setMinutes(0);
    base.setSeconds(0);
    base.setMilliseconds(0);

    return base;
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

    const nextDate = this.GetNextDate(newRegistorDataCycle.data.intarval[0]);

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
      registrationDate: new Date().getTime(),
      next: nextDate.getTime(),
      result: [{
        date: this.today.getTime(),
        rate: 0,
      }],
      resultOffset: 0,
      upDate: new Date().getTime(),
    };
    return registorData;
  }

  private GetNextDate(intarval: IIntarvalNode): Date {
    let randomDay = Math.ceil(intarval.day
      + (Math.random() - 1.0) * 2.0 * intarval.margin);
    if (randomDay < 1) {
      randomDay = intarval.day;
    }

    const now = this.GetBaseDate();
    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + randomDay);
    return nextDate;
  }

  private GetCycleCount(cycle: ICycleNode): number {
    let ret = 0;
    for (const iterator of cycle.intarval) {
      ret += iterator.repeat;
    }
    return ret;
  }

  private GetGoToInterval(cycle: ICycleNode, result: IWorkResult[], offset: number): IIntarvalNode {

    let count = 0;
    const times = result.length - offset;
    const ret = cycle.intarval.find(item => {
      count += item.repeat;
      return (count > times);
    });

    return ret;
  }

  private GetCycleFromWork(work: IWork): ICycleNode {
    let cycleIndex = this.cycleNodeViewModel.findIndex(item => item.data.id === work.cycleID);
    if (cycleIndex < 0) {
      cycleIndex = 0;
    }
    return this.cycleNodeViewModel[cycleIndex].data;
  }

  registerResult(work: IWorkNodeViewModel, point: number, offset: number): number {

    if (this._viewGraph.has(work)) {
      this._viewGraph.delete(work);
    }

    const current = new Date(this.today.getTime());

    const max = work.data.maxPoint;
    work.data.result.push({
      date: current.getTime(),
      rate: point / max,
    });

    work.data.resultOffset += offset;
    const gotoInterval =
      this.GetGoToInterval(work.cycle, work.data.result, work.data.resultOffset);

    if (gotoInterval != null) {
      const nextdate = this.GetNextDate(gotoInterval);
      work.data.next = nextdate.getTime();
      work.next = nextdate;
    }
    else {
      work.data.next = null;
      work.next = null;
    }
    work.data.upDate = new Date().getTime();

    this.store.AddWork(work.data);

    work.last = current;

    return this.workTarget.indexOf(work);
  }

  /*GetWork(observer: ((readValue: IWork) => void)
  ) {
    const userID = this.auth.TryGetUID();
    this.store.GetWork(userID, observer);
  }*/
}
