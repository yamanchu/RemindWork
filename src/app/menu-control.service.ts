import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuControlService {
  public title = 'Remind Work';
  public pcMode = false;
  public showSideMenu = false;
  private bodyWidthLimit = 600;
  public sideNaviMode = 'over'; // over,side,push
  ViewWidth: number;
  ViewHeight: number;

  constructor() { }

  public onResize(width: number, height: number) {
    this.ViewWidth = width;
    this.ViewHeight = height;
    this.pcMode = width >= this.bodyWidthLimit;

    if (this.pcMode) {
      this.sideNaviMode = 'side';
      this.showSideMenu = true;
    }
    else {
      this.sideNaviMode = 'over';
    }
  }

  public sideMenuToggle() {
    this.showSideMenu = !this.showSideMenu;
  }
}
