import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/ViewModels/user.service';
import { MenuControlService } from '../../ViewModels/menu-control.service';

@Component({
  selector: 'app-user-login-state',
  templateUrl: './user-login-state.component.html',
  styleUrls: ['./user-login-state.component.css']
})
export class UserLoginStateComponent implements OnInit {
  constructor(
    public menuControl: MenuControlService,
    public user: UserService) { }

  ngOnInit(): void {
  }

  public signOut() {
    this.user.signOut();
  }

}
