import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { FormGroup, FormControl } from '@angular/forms';

import { MenuControlService } from 'src/app/ViewModels/menu-control.service';

import { MatDialog } from '@angular/material/dialog';
import { LogintypeSelectorComponent, DialogData } from './logintypeSelector.component';

import { UserService } from 'src/app/ViewModels/user.service';

// import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  constructor(
    public menuControl: MenuControlService,
    private dialog: MatDialog,
    public user: UserService) { }

  ngOnInit() {
    this.onResize(window.innerWidth, window.innerHeight);

    /*
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);

      //------------------------------------
      // 未ログイン状態で訪れた場合
      //------------------------------------
      if (user === null) {
        //showMessage('Not Login', 'ログインが必要な画面です');
        //return (false);
      }

      //------------------------------------
      // メアド確認済み
      //------------------------------------
      if (user.emailVerified) {
        //showMessage('Login Complete!', `${user.displayName}さんがログインしました`);
      }
      //------------------------------------
      // メアド未確認
      //------------------------------------
      else {
        user.sendEmailVerification()
          .then(() => {
            //showMessage('Send confirm mail', `${user.email}宛に確認メールを送信しました`);
          })
          .catch((error) => {
            //showMessage('[Error] Can not send mail', `${user.email}宛に確認メールを送信できませんでした: ${error}`);
          });
      }
    });
*/

    /*
    const amap = new Map<string, number>();
    const bmap = new Map<string, number>();
    amap.set('aa', 1);
    amap.set('ab', 2);

    bmap.set('ba', 1);
    bmap.set('bb', 2);

    const map = new Map<string, Map<string, number>>();
    map.set('a', amap);
    map.set('b', bmap);
    for (const [key, value] of map) {
      console.log(key + ' , ' + value);
    }*/
  }

  @HostListener('window:resize', ['$event.target.innerWidth', '$event.target.innerHeight'])
  onResize(width: number, height: number) {
    this.menuControl.onResize(width, height);
  }

  GetStart(): void {
    if (this.user.hasLoginUser) {
      this.user.routerNavigate('user-main');
    }
    else {
      this.sohwDialog();
    }
  }

  sohwDialog() {
    const dialogRef = this.dialog.open(LogintypeSelectorComponent,
      {
        width: '300px',
        data: { result: true, select: 0 }
      }
    );

    dialogRef.afterClosed().subscribe(
      (ret: DialogData) => {
        if (ret.result) {
          this.user.login('user-main', ret.authResult);
        }
      }
    );
  }
}


