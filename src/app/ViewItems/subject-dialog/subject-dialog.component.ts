import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISubjectAreaNodeViewModel } from 'src/app/ViewModels/user.service';
import { FormControl } from '@angular/forms';
import { from } from 'rxjs';
import { ISubject } from 'src/app/fire/storeInterfaces/ITags';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface SubjectDialogData {
  selected: ISubject[];
  subjectAreaNodeViewModel: ISubjectAreaNodeViewModel;
  deleteItems: ISubject[];
  result: boolean;
}

@Component({
  selector: 'app-subject-dialog',
  templateUrl: './subject-dialog.component.html',
  styleUrls: ['./subject-dialog.component.css']
})
export class SubjectDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: SubjectDialogData) { }

  selected: boolean[];
  hasData: boolean;
  deleteMode: boolean;

  ngOnInit(): void {
    this.deleteMode = false;
    if (this.data.selected == null) {
      this.data.selected = new Array(0);
    }

    if (this.data.subjectAreaNodeViewModel == null) {
      this.selected = new Array(0);
    }
    else {
      this.selected = new Array(this.data.subjectAreaNodeViewModel.data.subjects.length);
      this.data.subjectAreaNodeViewModel.data.subjects
        .forEach((iterator, i) => {
          this.selected[i] = (this.data
            .selected
            .findIndex(item => item.id === iterator.id) >= 0);
        });
    }

    if (this.data.deleteItems == null) {
      this.data.deleteItems = new Array(0);
    }
    this.hasData = (this.selected.length > 0);
  }

  ckeckedChange(selectItem: ISubject, e: MatCheckboxChange) {
    if (e.checked) {
      if (!this.data.selected.includes(selectItem)) {
        this.data.selected.push(selectItem);
      }
    }
    else {
      const selectedIndex = this.data.selected.findIndex(item => item === selectItem);
      if (selectedIndex >= 0) {
        this.data.selected.splice(selectedIndex, 1);
      }
    }
  }

  onCancelClick(): void {
    this.data.result = false;
    this.data.selected = null;
    this.dialogRef.close(this.data);
  }

  onOkClick(): void {
    this.data.result = true;
    // this.data.selected = this.selectedItem;
    this.dialogRef.close(this.data);
  }

  deleteSubject(e: ISubject) {
    const delIndex =
      this.data.subjectAreaNodeViewModel.data.subjects.findIndex(item => item.id === e.id);
    if (delIndex >= 0) {
      this.selected[delIndex] = false;
      const delItem = this.data.subjectAreaNodeViewModel.data.subjects[delIndex];
      this.data.deleteItems.push(delItem);
      const selectedIndex = this.data.selected.indexOf(delItem);
      this.data.selected.splice(selectedIndex, 1);
    }
  }

  replaySubject(e: ISubject) {
    const delIndex =
      this.data.deleteItems.findIndex(item => item.id === e.id);
    if (delIndex >= 0) {
      this.data.deleteItems.splice(delIndex, 1);
    }
  }

  deleteModeChange() {
    this.data.deleteItems.splice(0);
  }
}
