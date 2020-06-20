import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { FormGroup, FormControl } from '@angular/forms';

import { MenuControlService } from 'src/app/menu-control.service';

import { MatDialog } from '@angular/material/dialog';
import { LogintypeSelectorComponent, DialogData } from './logintypeSelector.component';

import { UserService } from 'src/app/ViewModels/user.service';


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
          switch (ret.select) {
            case 0:
              this.user.googleLogin('user-main');
              // this.auth.googleLogin([''], this.router);
              break;
            case 1:
              // this.auth.eMailLogin([''], this.router);
              break;
            default:
              break;
          }
        }
      }
    );
  }
}


