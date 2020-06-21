import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { IWorkNodeViewModel, UserService, NextToGo } from 'src/app/ViewModels/user.service';
import { CreateWorkService } from '../../ViewModels/create-work.service';
import { ISubject, ISubjectArea } from '../../fire/storeInterfaces/ITags';
import { MenuControlService } from '../../ViewModels/menu-control.service';
import { SubjectAreaDialogComponent, SubjectAreaDialogData } from '../subject-area-dialog/subject-area-dialog.component';
import { SubjectDialogComponent, SubjectDialogData } from '../subject-dialog/subject-dialog.component';
import { Observable, from } from 'rxjs';
import { v4 as UUID } from 'uuid';

@Component({
  selector: 'app-work-create-view',
  templateUrl: './work-create-view.component.html',
  styleUrls: ['./work-create-view.component.css']
})
export class WorkCreateViewComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectableSubject: Observable<ISubject[]>;
  inputSubject: ISubject[];
  newWorkInputGroupe: FormGroup;

  @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public createWorkService: CreateWorkService,
    public menuControl: MenuControlService,
    public user: UserService) {

    this.inputSubject = new Array(0);

  }

  ngOnInit(): void {
    if (this.newWorkInputGroupe == null) {
      this.newWorkInputGroupe = this.formBuilder.group({
        overview: ['', Validators.required],
        point: [null, [Validators.required, Validators.min(1)]],
        cycle: [null, [Validators.required]],
        newSubjectAreas: [''],
        newSubject: [''],
        memo: [''],
      });
    }
  }

  subjectAreaEdit() {

    const inputText = this.newWorkInputGroupe.get('newSubjectAreas').value;
    const selectItem = this.user.subjectAreaNodeViewModel.find(item => item.data.name === inputText);

    const dialog = this.dialog.open(SubjectAreaDialogComponent, {
      data: {
        selected: selectItem,
        subjectAreaNodeViewModel: this.user.subjectAreaNodeViewModel,
        deleteItems: null,
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

    dialog.afterClosed().subscribe((ret: SubjectAreaDialogData) => {
      if (ret.result) {
        if (ret.selected != null) {
          this.newWorkInputGroupe
            .get('newSubjectAreas')
            .setValue(ret.selected.data.name);
        }
        this.user.DeleteCustomSubjectArea(ret.deleteItems);
      }
    });
  }

  subjectEdit() {

    const inputText = this.newWorkInputGroupe.get('newSubjectAreas').value;
    const selectItem = this.user.subjectAreaNodeViewModel.find(item => item.data.name === inputText);

    const dialog = this.dialog.open(SubjectDialogComponent, {
      data: {
        selected: this.inputSubject.slice(),
        subjectAreaNodeViewModel: selectItem,
        deleteItems: null,
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

    dialog.afterClosed().subscribe((ret: SubjectDialogData) => {
      if (ret.result) {
        this.inputSubject = ret.selected;
        this.user.DeleteCustomSubject(selectItem, ret.deleteItems);
      }
    });
  }

  private getSubjectArea(id: string): string {
    const index = this.user.subjectAreaNodeViewModel.findIndex(item => item.data.id === id);

    let ret = '';
    if (index > 0) {
      ret = this.user.subjectAreaNodeViewModel[index].data.name;
    }
    return ret;
  }

  removeSubject(removeItem: ISubject) {
    const index = this.inputSubject.findIndex(item => item.name === removeItem.name);
    if (index >= 0) {
      this.inputSubject.splice(index, 1);
    }
  }

  addSubject(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {

      const newName = value.trim();

      let findItrem = false;
      const inputText = this.newWorkInputGroupe.get('newSubjectAreas').value;
      const selectItem = this.user.subjectAreaNodeViewModel.find(item => item.data.name === inputText);

      if (selectItem != null) {
        const subjectItem = selectItem.data.subjects.find(item => item.name === newName);
        if (subjectItem != null) {
          this.inputSubject.push(subjectItem);
          findItrem = true;
        }
      }
      if (!findItrem) {
        const newID = UUID();
        this.inputSubject.push(
          {
            id: newID,
            name: newName,
          });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  selectedSubject(event: MatAutocompleteSelectedEvent): void {
    const select = event.option.value as ISubject;
    if (select != null) {
      this.inputSubject.push(select);
    }
    this.subjectInput.nativeElement.value = '';
    this.newWorkInputGroupe.get('newSubject').setValue(null);
  }

  registerWorkCnacel() {
    this.createWorkService.addMode = false;
  }

  registerWork() {
    const inputsubjectArea = this.newWorkInputGroupe.get('newSubjectAreas').value;
    const index = this.user.subjectAreaNodeViewModel.findIndex(item => item.data.name === inputsubjectArea);
    let subjectArea: ISubjectArea = null;

    if (index >= 0) {// 既存の教科が入力された
      subjectArea =
        this.user.AddSubject(inputsubjectArea, this.inputSubject);

    }
    else {
      const newID = UUID();
      subjectArea = {
        id: newID,
        name: inputsubjectArea,
        subjects: this.inputSubject,
      };
      this.user.AddSubjectAres(subjectArea);
    }


    const newTarget = this.user.AddWork(
      this.newWorkInputGroupe.get('cycle').value,
      this.inputSubject,
      subjectArea,
      UUID(),
      this.newWorkInputGroupe.get('overview').value,
      this.newWorkInputGroupe.get('memo').value,
      this.newWorkInputGroupe.get('point').value);

    // this.user.workAll.unshift(newTarget);
    this.user.workTarget.push(newTarget);
    this.createWorkService.addMode = false;
  }

  StartAddMode() {
    if (!this.createWorkService.addMode) {

      this.newWorkInputGroupe.get('overview').setValue(null);
      this.newWorkInputGroupe.get('point').setValue(null);
      this.newWorkInputGroupe.get('cycle').setValue(this.user.cycleNodeViewModel[0]);
      this.newWorkInputGroupe.get('newSubjectAreas').setValue(null);
      this.newWorkInputGroupe.get('newSubject').setValue(null);
      this.newWorkInputGroupe.get('memo').setValue(null);

      this.inputSubject.splice(0);

      this.createWorkService.addScroll = false;
      this.createWorkService.addMode = true;
    }
  }

}
