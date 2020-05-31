import { Injectable, IterableDiffers } from '@angular/core';
import { Router } from '@angular/router';

/* service */
import { AuthService } from '../fire/auth.service';
import { StoreService } from '../fire/store.service';
import { ICycles, ICycleNode } from '../fire/storeInterfaces/ICycles';
import { ISubjectAreas, ISubjectArea, ISubject } from '../fire/storeInterfaces/ITags';

import { interval } from 'rxjs';


export interface ICycleNodeViewModel {
  data: ICycleNode;
  isCustomNode: boolean;
  openView: boolean;
}

export interface ISubjectAreaNodeViewModel {
  data: ISubjectArea;
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

  LoadData() {

    if (!this.initialized) {
      this.store.GetDefaultCycles((cycles) => this.setCycleNodeViewModel(cycles));

      const uid = this.auth.TryGetUID();
      this.store.CreateUserData(uid,
        (cycles) => this.setCycleNodeViewModel(cycles),
        (subjectAreas) => this.setSubjectAreaViewModel(subjectAreas));

      /*this.store.GetDefaultCycles((cycles) => {
        for (const iterator of cycles.cycle) {
          this.cycleNodeViewModel.push(
            {
              data: iterator,
              isCustomNode: !cycles.published,
              openView: false,
            });
        }
      });

      const uid = this.auth.TryGetUID();
      this.store.CreateUserData(uid, (cycles) => {

        console.log(cycles);

        for (const iterator of cycles.cycle) {
          this.cycleNodeViewModel.push(
            {
              data: iterator,
              isCustomNode: !cycles.published,
              openView: false,
            });
        }
      });*/
      this.initialized = true;
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
}
