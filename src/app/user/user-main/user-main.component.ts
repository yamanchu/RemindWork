import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { MenuControlService } from '../../ViewModels/menu-control.service';
import { UserService } from '../../ViewModels/user.service';
import { CreateWorkService } from '../../ViewModels/create-work.service';
import { WorkCreateViewComponent } from '../../ViewItems/work-create-view/work-create-view.component';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit, AfterViewChecked {
  @ViewChild('sidenavContent') sidenavContent: MatSidenavContent;

  /** 子コンポーネントを読み込む */
  @ViewChild(WorkCreateViewComponent)
  private workCreateView: WorkCreateViewComponent;


  constructor(
    protected createWorkService: CreateWorkService,
    public menuControl: MenuControlService,
    public user: UserService) {
  }

  get addMode(): boolean {
    return this.createWorkService.addMode;
  }

  ngOnInit() {
    this.createWorkService.addMode = false;
    if (this.user.hasLoginUser) {
      this.onResize(window.innerWidth, window.innerHeight);
      this.user.LoadData();
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
    this.workCreateView.StartAddMode();
  }

  ngAfterViewChecked() {
    if (!this.createWorkService.addScroll &&
      this.createWorkService.addMode &&
      this.sidenavContent.getElementRef() != null &&
      this.sidenavContent.getElementRef().nativeElement != null) {

      this.createWorkService.addScroll = true;
      const elementHtml = document.documentElement;
      const bottom = elementHtml.scrollHeight - elementHtml.clientHeight;

      const cliantBottom =
        this.sidenavContent.getElementRef().nativeElement.scrollHeight
        - this.sidenavContent.getElementRef().nativeElement.clientHeight;

      setTimeout(() => {
        window.scroll(0, bottom);
        this.sidenavContent.scrollTo({ top: cliantBottom });
      });
    }
  }
}

