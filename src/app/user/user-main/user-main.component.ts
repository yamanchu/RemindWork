import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from '../user.service';
import { MenuControlService } from 'src/app/menu-control.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { v4 as UUID } from 'uuid';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface IviewSubjectArea {
  id: string;
  name: string;
}

export interface IviewSubject {
  id: string;
  name: string;
}

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // tslint:disable-next-line: variable-name
  _subjectAreas: IviewSubjectArea[];
  // tslint:disable-next-line: variable-name
  _subject: IviewSubject[];
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor(
    public menuControl: MenuControlService,
    public user: UserService) { }

  addMode = false;

  get subjectAreas(): IviewSubjectArea[] {
    if (this._subjectAreas == null) {
      this._subjectAreas = new Array(0);
    }
    return this._subjectAreas;
  }

  get subject(): IviewSubject[] {
    if (this._subject == null) {
      this._subject = new Array(0);
    }
    return this._subject;
  }

  ngOnInit() {
    if (this.user.hasLoginUser) {
      this.onResize(window.innerWidth, window.innerHeight);
      this.user.LoadData();
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
    else {
      this.user.routerNavigate('');
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  private getSubjectArea(id: string): string {
    const index = this.user.subjectAreaNodeViewModel.findIndex(item => item.data.id === id);

    let ret = '';
    if (index > 0) {
      ret = this.user.subjectAreaNodeViewModel[index].data.name;
    }
    return ret;
  }

  removeSubjectArea(item: IviewSubjectArea) {
    const index = this.subjectAreas.indexOf(item);
    if (index >= 0) {
      this.subjectAreas.splice(index, 1);
    }
  }

  addSubjectAreas(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {

      const newName = value.trim();
      const newID = UUID();
      const index = this.subjectAreas.findIndex(item => item.name === newName);
      if (index < 0) {
        if (this.subjectAreas.length > 0) {
          this.subjectAreas.pop();
        }

        this.subjectAreas.push(
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

  removeSubject(item: IviewSubject) {
    const index = this.subject.indexOf(item);
    if (index >= 0) {
      this.subject.splice(index, 1);
    }
  }

  addSubject(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {

      const newName = value.trim();
      const newID = UUID();
      const index = this.subject.findIndex(item => item.name === newName);
      if (index < 0) {

        this.subject.push(
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

  @HostListener('window:resize', ['$event.target.innerWidth', '$event.target.innerHeight'])
  onResize(width: number, height: number) {
    this.menuControl.onResize(width, height);
  }

  StartAddMode() {
    if (!this.addMode) {
      this.addMode = true;
    }
  }
}
