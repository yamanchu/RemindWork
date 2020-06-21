import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UserService } from 'src/app/ViewModels/user.service';
import { MenuControlService } from '../../ViewModels/menu-control.service';

@Component({
  selector: 'app-side-navi-menu',
  templateUrl: './side-navi-menu.component.html',
  styleUrls: ['./side-navi-menu.component.css']
})
export class SideNaviMenuComponent implements OnInit {

  @Input() current: string;

  constructor(
    public menuControl: MenuControlService,
    public user: UserService) { }

  ngOnInit(): void {
  }

  get userMainLink(): string {
    const link = '/user-main';
    if (this.current !== link) {
      return link;
    }
    else {
      return null;
    }
  }

  get analysisLink(): string {
    const link = '/analysis';
    if (this.current !== link) {
      return link;
    }
    else {
      return null;
    }
  }

  get intervalLink(): string {
    const link = '/interval';
    if (this.current !== link) {
      return link;
    }
    else {
      return null;
    }
  }
}
