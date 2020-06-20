import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from '../../ViewModels/user.service';
import { MenuControlService } from 'src/app/menu-control.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  constructor(
    public menuControl: MenuControlService,
    public user: UserService) { }

  ngOnInit() {
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

}
