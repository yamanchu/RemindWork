import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISubjectAreaNodeViewModel } from '../../user.service';
import { FormControl } from '@angular/forms';
import { from } from 'rxjs';

export interface SubjectAreaDialogData {
  title: string;
  selected: ISubjectAreaNodeViewModel;
  subjectAreaNodeViewModel: ISubjectAreaNodeViewModel[];
  result: boolean;
}

@Component({
  selector: 'app-subject-area-dialog',
  templateUrl: './subject-area-dialog.component.html',
  styleUrls: ['./subject-area-dialog.component.css']
})
export class SubjectAreaDialogComponent implements OnInit {
  selectedItem: ISubjectAreaNodeViewModel;

  constructor(
    public dialogRef: MatDialogRef<SubjectAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: SubjectAreaDialogData) { }

  ngOnInit(): void {
    this.selectedItem = this.data.selected;
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
}
