import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { UserService } from 'src/app/ViewModels/user.service';
import { MenuControlService } from 'src/app/ViewModels/menu-control.service';
import { CreateIntervalService } from '../../ViewModels/create-interval.service';
import { IntervalCreateViewComponent } from '../../ViewItems/interval-create-view/interval-create-view.component';

@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.css']
})
export class IntervalComponent implements OnInit {
  /** 子コンポーネントを読み込む */
  @ViewChild(IntervalCreateViewComponent)
  private intervalCreateView: IntervalCreateViewComponent;

  constructor(
    protected createIntervalService: CreateIntervalService,
    public menuControl: MenuControlService,
    public user: UserService) { }

  get addMode(): boolean {
    return this.createIntervalService.addMode;
  }

  ngOnInit() {

    this.createIntervalService.addMode = false;

    if (this.user.hasLoginUser) {
      this.onResize(window.innerWidth, window.innerHeight);
      this.user.LoadData();

      if (!this.menuControl.pcMode) {
        this.menuControl.showSideMenu = false;
      }
    }
    else {
      this.user.routerNavigate('');
    }
  }


  @HostListener('window:resize', ['$event.target.innerWidth', '$event.target.innerHeight'])
  onResize(width: number, height: number) {
    this.menuControl.onResize(width, height);
  }

  StartAddMode() {
    this.intervalCreateView.StartAddMode();
  }
}
