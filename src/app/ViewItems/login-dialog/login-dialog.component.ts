import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { UserService } from 'src/app/ViewModels/user.service';

export interface DialogData {
  result: boolean;
  authResult: firebase.auth.UserCredential;
}


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    public user: UserService) { }

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
    // this.cancel();
  }

}
