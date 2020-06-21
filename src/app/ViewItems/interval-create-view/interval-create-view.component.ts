import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/ViewModels/user.service';
import { MenuControlService } from '../../ViewModels/menu-control.service';
import { CreateIntervalService } from '../../ViewModels/create-interval.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ICycleNode } from '../../fire/storeInterfaces/ICycles';
import { v4 as UUID } from 'uuid';

import { from } from 'rxjs';

@Component({
  selector: 'app-interval-create-view',
  templateUrl: './interval-create-view.component.html',
  styleUrls: ['./interval-create-view.component.css']
})
export class IntervalCreateViewComponent implements OnInit {
  cycleGroupe: FormGroup;
  intervalIndex: number[];

  constructor(
    private formBuilder: FormBuilder,
    public createIntervalService: CreateIntervalService,
    public menuControl: MenuControlService,
    public user: UserService) { }

  ngOnInit(): void {
    this.initializeData();
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



  CloseAddCustomCycle() {
    if (this.createIntervalService.addMode) {
      this.CancelAddCustomCycle();
    }
  }

  CancelAddCustomCycle() {
    if (this.createIntervalService.addMode) {
      this.createIntervalService.addMode = false;
      this.initializeData();
    }
  }

  AddCustomCycle() {

    if (this.createIntervalService.addMode) {
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
      this.createIntervalService.addMode = false;
      this.initializeData();
    }
  }

  get days(): FormArray {
    return this.cycleGroupe.get('days') as FormArray;
  }

  get margins(): FormArray {
    return this.cycleGroupe.get('margins') as FormArray;
  }

  get repeats(): FormArray {
    return this.cycleGroupe.get('repeats') as FormArray;
  }

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
    if (!this.createIntervalService.addMode) {
      this.createIntervalService.addMode = true;
    }
  }
}
