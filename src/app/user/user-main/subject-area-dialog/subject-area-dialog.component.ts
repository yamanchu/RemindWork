import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISubjectAreaNodeViewModel } from '../../user.service';
import { FormControl } from '@angular/forms';
import { from } from 'rxjs';
import { ISubject, ISubjectArea } from 'src/app/fire/storeInterfaces/ITags';

export interface SubjectAreaDialogData {
  title: string;
  selected: ISubjectAreaNodeViewModel;
  subjectAreaNodeViewModel: ISubjectAreaNodeViewModel[];
  deleteItems: ISubjectArea[];
  result: boolean;
}

@Component({
  selector: 'app-subject-area-dialog',
  templateUrl: './subject-area-dialog.component.html',
  styleUrls: ['./subject-area-dialog.component.css']
})
export class SubjectAreaDialogComponent implements OnInit {
  selectedItem: ISubjectAreaNodeViewModel;
  hasData: boolean;
  deleteMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<SubjectAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: SubjectAreaDialogData) { }

  ngOnInit(): void {
    this.selectedItem = this.data.selected;
    this.data.deleteItems = new Array(0);
    this.hasData = false;
    for (const iterator of this.data.subjectAreaNodeViewModel) {
      if (iterator.data.name !== '') {
        this.hasData = true;
        break;
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
    this.data.selected = this.selectedItem;
    this.dialogRef.close(this.data);
  }

  deleteSubjectArea(e: ISubjectAreaNodeViewModel) {
    const delItem =
      this.data.subjectAreaNodeViewModel.find(item => item.data.id === e.data.id);
    if (delItem != null) {
      if (this.selectedItem === delItem) {
        this.selectedItem = null;
      }
      this.data.deleteItems.push(delItem.data);
    }
  }

  replaySubjectArea(e: ISubjectAreaNodeViewModel) {
    const delIndex =
      this.data.deleteItems.findIndex(item => item.id === e.data.id);
    if (delIndex >= 0) {
      this.data.deleteItems.splice(delIndex, 1);
    }
  }

  deleteModeChange() {
    this.data.deleteItems.splice(0);
  }
}
