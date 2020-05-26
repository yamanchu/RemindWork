import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';

export interface DialogData {
  result: boolean;
  select: number;
}

@Component({
  selector: 'app-logintypeselector',
  templateUrl: './logintypeSelector.component.html',
  styleUrls: ['./logintypeSelector.component.css']
})
export class LogintypeSelectorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LogintypeSelectorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData) { }

  ngOnInit(): void {
    this.data.select = 0;
    this.data.result = true;
  }

  googleLogin() {
    this.data.select = 0;
    this.data.result = true;
    this.dialogRef.close(this.data);
  }

  ok() {
    this.data.result = true;
    this.dialogRef.close(this.data);
  }

  cancel() {
    this.data.result = false;
    this.dialogRef.close(this.data);
  }
}
