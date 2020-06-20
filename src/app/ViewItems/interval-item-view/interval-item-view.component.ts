import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICycleNodeViewModel, UserService } from 'src/app/ViewModels/user.service';
import { MenuControlService } from '../../menu-control.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { FormBuilder } from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-interval-item-view',
  templateUrl: './interval-item-view.component.html',
  styleUrls: ['./interval-item-view.component.css']
})
export class IntervalItemViewComponent implements OnInit {

  @Input() targetItem: ICycleNodeViewModel;

  constructor(
    private dialog: MatDialog,
    public menuControl: MenuControlService,
    public user: UserService) { }

  ngOnInit(): void {
  }

  DeleteCycleButtonEventHandler(eventArgs: MouseEvent, id: string) {

    // const posX = String(eventArgs.clientX) + 'px';
    // const posY = String(this.menuControl.ViewHeight - eventArgs.clientY) + 'px';
    const dialog = this.dialog.open(MessageDialogComponent, {
      data: {
      },
      width: '300px',
      disableClose: false,
      /*position: {
        bottom: posY,
        left: posX,
      },*/
    });

    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.user.DeleteCustomCycle(id);
      }
    });

  }
}
