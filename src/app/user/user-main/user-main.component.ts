import { Component, OnInit, HostListener, Input, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { MenuControlService } from 'src/app/menu-control.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { v4 as UUID } from 'uuid';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map, startWith, find, findIndex, tap } from 'rxjs/operators';
import { ISubjectArea, ISubject } from '../../fire/storeInterfaces/ITags';
import { MatDialog } from '@angular/material/dialog';
import { SubjectAreaDialogComponent, SubjectAreaDialogData } from './subject-area-dialog/subject-area-dialog.component';
import { SubjectDialogComponent, SubjectDialogData } from './subject-dialog/subject-dialog.component';
/*
export interface IviewSubjectArea {
  id: string;
  name: string;
}

export interface IviewSubject {
  id: string;
  name: string;
}
*/


@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  newWorkInputGroupe: FormGroup;
  selectableSubject: Observable<ISubject[]>;
  // selectableSubjectSrc: ISubject[];
  inputSubject: ISubject[];

  @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;

  constructor(
    private dialog: MatDialog,
    public menuControl: MenuControlService,
    public user: UserService,
    private formBuilder: FormBuilder) {

    this.inputSubject = new Array(0);

    this.newWorkInputGroupe = this.formBuilder.group({
      newSubjectAreas: [''],
      newSubject: [''],
    });
  }

  addMode = false;


  ngOnInit() {
    if (this.user.hasLoginUser) {
      this.onResize(window.innerWidth, window.innerHeight);
      this.user.LoadData();

    }
    else {
      this.user.routerNavigate('');
    }
  }

  subjectAreaEdit() {

    const inputText = this.newWorkInputGroupe.get('newSubjectAreas').value;
    const selectItem = this.user.subjectAreaNodeViewModel.find(item => item.data.name === inputText);

    const dialog = this.dialog.open(SubjectAreaDialogComponent, {
      data: {
        title: '教科を選択',
        selected: selectItem,
        subjectAreaNodeViewModel: this.user.subjectAreaNodeViewModel,
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
        this.newWorkInputGroupe
          .get('newSubjectAreas')
          .setValue(ret.selected.data.name);
      }
    });
  }

  subjectEdit() {

    const inputText = this.newWorkInputGroupe.get('newSubjectAreas').value;
    const selectItem = this.user.subjectAreaNodeViewModel.find(item => item.data.name === inputText);

    const dialog = this.dialog.open(SubjectDialogComponent, {
      data: {
        title: '科目 又は 分類を選択',
        selected: this.inputSubject.slice(),
        subjectAreaNodeViewModel: selectItem,
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

  registerWork() {
    const inputsubjectArea = this.newWorkInputGroupe.get('newSubjectAreas').value;
    const index = this.user.subjectAreaNodeViewModel.findIndex(item => item.data.name === inputsubjectArea);
    if (index >= 0) {// 既存の教科が入力された
      this.user.AddSubject(inputsubjectArea, this.inputSubject);
    }
    else {
      const newID = UUID();
      const subjectArea: ISubjectArea = {
        id: newID,
        name: inputsubjectArea,
        subjects: this.inputSubject,
      };
      this.user.AddSubjectAres(subjectArea);
    }
  }

  @HostListener('window:resize', ['$event.target.innerWidth', '$event.target.innerHeight'])
  onResize(width: number, height: number) {
    this.menuControl.onResize(width, height);
  }

  StartAddMode() {
    if (!this.addMode) {
      if (this.subjectInput != null) {
        this.subjectInput.nativeElement.value = '';
      }
      if (this.newWorkInputGroupe != null && this.newWorkInputGroupe.get('newSubject') != null) {
        this.newWorkInputGroupe.get('newSubject').setValue(null);
      }
      this.addMode = true;
    }
  }
}
