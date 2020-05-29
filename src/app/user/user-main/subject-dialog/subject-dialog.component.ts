import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISubjectAreaNodeViewModel } from '../../user.service';
import { FormControl } from '@angular/forms';
import { from } from 'rxjs';
import { ISubject } from 'src/app/fire/storeInterfaces/ITags';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface SubjectDialogData {
  title: string;
  selected: ISubject[];
  subjectAreaNodeViewModel: ISubjectAreaNodeViewModel;
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

  ngOnInit(): void {
    if (this.data == null) {
      this.data.selected = new Array(0);
    }
  }

  ckeckedChange(e: MatCheckboxChange) {
    if (e.checked) {
      const selectItem = this.data.subjectAreaNodeViewModel.data.subjects.find(item => item.id === e.source.value);
      if (!this.data.selected.includes(selectItem)) {
        this.data.selected.push(selectItem);
      }
    }
    else {
      const selectedIndex = this.data.selected.findIndex(item => item.id === e.source.value);
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
}
