import { Injectable, IterableDiffers } from '@angular/core';
import { Router } from '@angular/router';

/* service */
import { AuthService } from '../fire/auth.service';
import { StoreService } from '../fire/store.service';
import { ICycles, ICycleNode } from '../fire/storeInterfaces/ICycles';
import { ISubjectAreas, ISubjectArea } from '../fire/storeInterfaces/ITags';

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
}
