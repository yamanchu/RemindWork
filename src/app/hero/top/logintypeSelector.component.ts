import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';

export interface DialogData {
  result: boolean;
  authResult: firebase.auth.UserCredential;
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
    this.data.result = true;
  }

  cancel() {
    this.data.result = false;
    this.data.authResult = null;
    this.dialogRef.close(this.data);
  }

  // 成功時のコールバック
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.data.result = true;
    this.data.authResult = signInSuccessData.authResult;
    this.dialogRef.close(this.data);
  }

  // 失敗時のコールバック
  async errorCallback(errorData: FirebaseUISignInFailure) {
    //this.cancel();
  }

}
