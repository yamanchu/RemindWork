import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCard } from '@angular/material/card';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavContent } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { MenuControlService } from 'src/app/menu-control.service';
import { v4 as UUID } from 'uuid';
import { ISubject, ISubjectArea } from '../../fire/storeInterfaces/ITags';
import { IWorkNodeViewModel, UserService } from '../user.service';
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
export class UserMainComponent implements OnInit, AfterViewChecked {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  newWorkInputGroupe: FormGroup;
  resultFormGroupMap: Map<IWorkNodeViewModel, FormGroup>;
  selectableSubject: Observable<ISubject[]>;
  // selectableSubjectSrc: ISubject[];
  inputSubject: ISubject[];

  // sidenavContent
  @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;
  @ViewChild('sidenavContent') sidenavContent: MatSidenavContent;
  @ViewChild('editCard') editCard: MatCard;

  constructor(
    private dialog: MatDialog,
    public menuControl: MenuControlService,
    public user: UserService,
    private formBuilder: FormBuilder) {

    this.inputSubject = new Array(0);

    this.newWorkInputGroupe = this.formBuilder.group({
      overview: ['', Validators.required],
      point: [null, [Validators.required, Validators.min(1)]],
      cycle: [null, [Validators.required]],
      newSubjectAreas: [''],
      newSubject: [''],
      memo: [''],
    });

    this.resultFormGroupMap = new Map<IWorkNodeViewModel, FormGroup>();

    /*
    this.resultGroupe = this.formBuilder.group({
      // point: this.formBuilder.array(
      //  [this.formBuilder.control(null, [Validators.required, Validators.min(1)])])
      points: this.formBuilder.array(null)
    });*/
  }

  addMode = false;
  addScroll = false;

  ngOnInit() {
    if (this.user.hasLoginUser) {
      this.onResize(window.innerWidth, window.innerHeight);
      this.user.LoadData();
    }
    else {
      this.user.routerNavigate('');
    }
  }

  GetResultFormGroup(workNodeViewModel: IWorkNodeViewModel): FormGroup {
    if (!this.resultFormGroupMap.has(workNodeViewModel)) {
      const newFormGroup = this.formBuilder.group({
        point: [null, [Validators.required, Validators.min(0), Validators.max(workNodeViewModel.data.maxPoint)]]
      });
      this.resultFormGroupMap.set(workNodeViewModel, newFormGroup);
    }
    return this.resultFormGroupMap.get(workNodeViewModel);
  }

  subjectAreaEdit() {

    const inputText = this.newWorkInputGroupe.get('newSubjectAreas').value;
    const selectItem = this.user.subjectAreaNodeViewModel.find(item => item.data.name === inputText);

    const dialog = this.dialog.open(SubjectAreaDialogComponent, {
      data: {
        title: '教科を選択',
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
        title: '科目 又は 分類を選択',
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
    this.addMode = false;
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
    this.addMode = false;
  }

  registerResult(work: IWorkNodeViewModel) {
    const point = this.GetResultFormGroup(work).get('point').value as number;
    const workTargetIndex = this.user.registerResult(work, point);
    if (workTargetIndex >= 0 && workTargetIndex < this.user.workTarget.length - 1) {
      this.user.workTarget.splice(workTargetIndex, 1);
      this.user.workTarget.push(work);
    }
  }
  /*
  private GetWork(subjectArea: ISubjectArea): IWork {
    const newRegistorDataID = UUID();
    const newRegistorDataCycle = this.newWorkInputGroupe.get('cycle').value as ICycleNodeViewModel;
    const subjectIDs: string[] = new Array(0);
    for (const iterator of this.inputSubject) {
      subjectIDs.push(iterator.id);
    }
    const intarval = newRegistorDataCycle.data.intarval[0];
    let randomDay = Math.ceil(intarval.day
      + (Math.random() - 1.0) * 2.0 * intarval.margin);
    if (randomDay < 1) {
      randomDay = intarval.day;
    }
    const now = new Date();
    const nextDate = new Date(now.setDate(now.getDate() + randomDay));
    const registorData: IWork = {
      id: newRegistorDataID,
      cycleID: newRegistorDataCycle.data.id,
      overview: this.newWorkInputGroupe.get('overview').value,
      memo: this.newWorkInputGroupe.get('memo').value,
      maxPoint: this.newWorkInputGroupe.get('point').value,
      subjectAreaID: subjectArea.id,
      subjectID: subjectIDs,
      registrationDate: new Date(),
      next: nextDate,
      result: [{
        date: new Date(),
        rate: 0,
      }],
      resultOffset: 0,
    };
    return registorData;
  }
*/

  @HostListener('window:resize', ['$event.target.innerWidth', '$event.target.innerHeight'])
  onResize(width: number, height: number) {
    this.menuControl.onResize(width, height);
  }

  StartAddMode() {
    if (!this.addMode) {
      /*
      if (this.subjectInput != null) {
        this.subjectInput.nativeElement.value = '';
      }
      if (this.newWorkInputGroupe != null && this.newWorkInputGroupe.get('newSubject') != null) {
        this.newWorkInputGroupe.get('newSubject').setValue(null);
      }*/

      this.newWorkInputGroupe.get('overview').setValue(null);
      this.newWorkInputGroupe.get('point').setValue(null);
      this.newWorkInputGroupe.get('cycle').setValue(this.user.cycleNodeViewModel[0]);
      this.newWorkInputGroupe.get('newSubjectAreas').setValue(null);
      this.newWorkInputGroupe.get('newSubject').setValue(null);
      this.newWorkInputGroupe.get('memo').setValue(null);

      this.inputSubject.splice(0);

      this.addScroll = false;
      this.addMode = true;
    }
  }

  ngAfterViewChecked() {
    if (!this.addScroll &&
      this.addMode &&
      this.sidenavContent.getElementRef() != null &&
      this.sidenavContent.getElementRef().nativeElement != null) {
      this.addScroll = true;
      const elementHtml = document.documentElement;
      const bottom = elementHtml.scrollHeight - elementHtml.clientHeight;

      const cliantBottom =
        this.sidenavContent.getElementRef().nativeElement.scrollHeight
        - this.sidenavContent.getElementRef().nativeElement.clientHeight;

      setTimeout(() => {
        window.scroll(0, bottom);
        this.sidenavContent.scrollTo({ top: cliantBottom });
      });
    }
  }
}
