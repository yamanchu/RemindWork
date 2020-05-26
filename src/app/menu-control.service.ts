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

  constructor() { }

  public onResize(width: number, height: number) {
    const textMenu = this.pcMode;
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
