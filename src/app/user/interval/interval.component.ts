import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { IIntarvalNode, ICycleNode } from '../../fire/storeInterfaces/ICycles';
import { MenuControlService } from 'src/app/menu-control.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent, MessageDialogData } from '../message-dialog/message-dialog.component';
import { v4 as UUID } from 'uuid';

import { from } from 'rxjs';
import { database } from 'firebase';
@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.css']
})
export class IntervalComponent implements OnInit {
  editMode = false;
  cycleGroupe: FormGroup;
  intervalIndex: number[];
  addMode = false;

  constructor(
    private dialog: MatDialog,
    public menuControl: MenuControlService,
    public user: UserService,
    private formBuilder: FormBuilder) { }

  displayedColumns: string[] = ['day', 'margin', 'repeat'];

  ngOnInit() {

    this.addMode = false;
    this.initializeData();

    if (this.user.hasLoginUser) {
      this.onResize(window.innerWidth, window.innerHeight);
      this.user.LoadData();
    }
    else {
      this.user.routerNavigate('');
    }
  }

  private initializeData() {
    this.cycleGroupe = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      days: this.formBuilder.array(
        [this.formBuilder.control(1, [Validators.required, Validators.min(1)])]),
      margins: this.formBuilder.array(
        [this.formBuilder.control(0, [Validators.required, Validators.min(0)])]),
      repeats: this.formBuilder.array(
        [this.formBuilder.control(1, [Validators.required, Validators.min(1)])])
    });

    this.intervalIndex = [0];
  }

  DeleteCycleButtonEventHandler(eventArgs: MouseEvent, id: string) {

    // const posX = String(eventArgs.clientX) + 'px';
    // const posY = String(this.menuControl.ViewHeight - eventArgs.clientY) + 'px';
    const dialog = this.dialog.open(MessageDialogComponent, {
      data: {
        title: '削除確認',
        message: '復習間隔を削除します。よろしいですか？'
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

  CloseAddCustomCycle() {
    if (this.addMode) {
      this.CancelAddCustomCycle();
    }
  }

  CancelAddCustomCycle() {
    if (this.addMode) {
      this.addMode = false;
      this.initializeData();
    }
  }

  AddCustomCycle() {

    if (this.addMode) {
      const intarvalNodes = new Array(0);

      for (const i of this.intervalIndex) {
        intarvalNodes.push({
          day: this.days.controls[i].value,
          margin: this.margins.controls[i].value,
          repeat: this.repeats.controls[i].value
        });
      }

      const cycleNode: ICycleNode = {
        id: UUID(),
        name: this.cycleGroupe.get('name').value,
        description: this.cycleGroupe.get('description').value,
        intarval: intarvalNodes,
      };

      this.user.AddCustomCycle(cycleNode);
      this.addMode = false;
      this.initializeData();
    }
  }

  /*
  createCycle() {

    const intarvalNodes: IIntarvalNode[] = Array(this.intervalIndex.length);

    for (const i of this.intervalIndex) {
      intarvalNodes[i] = {
        day: this.days.controls[i].value,
        margin: this.margins.controls[i].value,
        repeat: this.repeats.controls[i].value
      };

      const cycleNode: ICycleNode = {
        name: this.cycleGroupe.get('name').value,
        description: this.cycleGroupe.get('description').value,
        intarval: intarvalNodes,
      };

      // map.set(UUID(),
    }
  }
  */

  get days(): FormArray {
    return this.cycleGroupe.get('days') as FormArray;
  }

  get margins(): FormArray {
    return this.cycleGroupe.get('margins') as FormArray;
  }

  get repeats(): FormArray {
    return this.cycleGroupe.get('repeats') as FormArray;
  }

  @HostListener('window:resize', ['$event.target.innerWidth', '$event.target.innerHeight'])
  onResize(width: number, height: number) {
    this.menuControl.onResize(width, height);
  }

  /*
  editModeOn() {
    this.editMode = true;
  }
*/

  removeInterval() {
    if (this.intervalIndex.length > 1) {
      const days = this.cycleGroupe.get('days') as FormArray;
      const margins = this.cycleGroupe.get('margins') as FormArray;
      const repeats = this.cycleGroupe.get('repeats') as FormArray;

      days.removeAt(this.intervalIndex.length - 1);
      margins.removeAt(this.intervalIndex.length - 1);
      repeats.removeAt(this.intervalIndex.length - 1);

      const indexArray = this.intervalIndex.slice();
      indexArray.pop();
      this.intervalIndex = indexArray;

    }
  }

  private CreateNewFormControl(controlArray: FormArray, defaultValue: number): FormControl {
    if (controlArray.controls.length > 0) {
      const value = controlArray.controls[controlArray.controls.length - 1].value as number;
      const valid = controlArray.controls[controlArray.controls.length - 1].validator;
      return this.formBuilder.control(value, valid);
    }
    else {
      return this.formBuilder.control(defaultValue);
    }
  }

  addInterval() {
    if (this.days.controls.length <= this.intervalIndex.length) {
      this.days.push(
        this.CreateNewFormControl(this.days, 1)
      );
    }

    if (this.margins.controls.length <= this.intervalIndex.length) {
      this.margins.push(
        this.CreateNewFormControl(this.margins, 0)
      );
    }
    if (this.repeats.controls.length <= this.intervalIndex.length) {
      this.repeats.push(
        this.CreateNewFormControl(this.repeats, 1)
      );
    }

    const indexArray = this.intervalIndex.slice();
    indexArray.push(this.intervalIndex.length);
    this.intervalIndex = indexArray;
  }

  StartAddMode() {
    if (!this.addMode) {
      this.addMode = true;
    }
  }
}
