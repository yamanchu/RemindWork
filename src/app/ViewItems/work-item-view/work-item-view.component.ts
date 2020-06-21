import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IWorkNodeViewModel, UserService, NextToGo } from 'src/app/ViewModels/user.service';
import { MenuControlService } from '../../ViewModels/menu-control.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectNextNextToGoDialogComponent, SelectNextNextToGoDialogData } from '../select-next-next-to-go-dialog/select-next-next-to-go-dialog.component';

import { Input } from '@angular/core';

@Component({
  selector: 'app-work-item-view',
  templateUrl: './work-item-view.component.html',
  styleUrls: ['./work-item-view.component.css']
})
export class WorkItemViewComponent implements OnInit {

  listType = NextToGo;
  resultFormGroup: FormGroup;

  @Input() targetItem: IWorkNodeViewModel;
  @Input() targetIndex: number;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public menuControl: MenuControlService,
    public user: UserService) {

  }

  ngOnInit(): void {
    if (this.resultFormGroup == null) {
      this.resultFormGroup = this.formBuilder.group({
        point: [null, [Validators.required, Validators.min(0), Validators.max(this.targetItem.data.maxPoint)]],
        apply: ['next', Validators.required]
      });
    }
  }

  selectNextNextToGo(workNodeViewModel: IWorkNodeViewModel) {
    const dialog = this.dialog.open(SelectNextNextToGoDialogComponent, {
      data: {
        nextDisable: workNodeViewModel.isLastWork,
        model: workNodeViewModel,
        result: false,
      },
      width: '300px',
      height: 'auto',
      maxHeight: this.menuControl.ViewHeight,
      disableClose: false,
      /*position: {
        bottom: posY,
        left: posX,
      },*/
    });
  }

  registerResult() {
    const point = this.resultFormGroup.get('point').value as number;
    const workTargetIndex = this.user.workTarget.indexOf(this.targetItem);
    if (workTargetIndex >= 0 && workTargetIndex < this.user.workTarget.length) {
      const view = this.user.workTarget.splice(workTargetIndex, 1);
      let offset = 0;
      const target = view[0];
      switch (target.nextToGo) {
        case NextToGo.Next:
          offset = 0;
          break;
        case NextToGo.Repeat:
          offset = -1;
          break;
        case NextToGo.ReStart:
          offset = -target.data.result.length;
          break;
        case NextToGo.Finish:
          offset = target.cycleCount - target.data.result.length;
          break;
        default:
          offset = 0;
          break;
      }
      this.user.registerResult(this.targetItem, point, offset);
      this.user.workTarget.push(this.targetItem);
    }
  }
}
