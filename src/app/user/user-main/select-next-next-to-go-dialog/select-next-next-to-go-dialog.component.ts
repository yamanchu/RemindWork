import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IWorkNodeViewModel, NextToGo } from '../../user.service';
import { FormControl } from '@angular/forms';
import { from } from 'rxjs';

export interface SelectNextNextToGoDialogData {
  title: string;
  result: boolean;
  nextDisable: boolean;
  model: IWorkNodeViewModel;
}

@Component({
  selector: 'app-select-next-next-to-go-dialog',
  templateUrl: './select-next-next-to-go-dialog.component.html',
  styleUrls: ['./select-next-next-to-go-dialog.component.css']
})
export class SelectNextNextToGoDialogComponent implements OnInit {
  listType = NextToGo;

  selectedItem: NextToGo;

  constructor(
    public dialogRef: MatDialogRef<SelectNextNextToGoDialogData>,
    @Inject(MAT_DIALOG_DATA)
    public data: SelectNextNextToGoDialogData) {
    this.selectedItem = data.model.nextToGo;
  }

  ngOnInit(): void {
  }

  onCancelClick() {
    this.data.result = false;
    this.dialogRef.close(this.data);
  }

  onOkClick() {
    this.data.result = true;
    this.data.model.nextToGo = this.selectedItem;
    this.dialogRef.close(this.data);
  }

}
