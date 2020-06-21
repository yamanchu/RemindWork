import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/ViewModels/user.service';
import { MenuControlService } from 'src/app/ViewModels/menu-control.service';

@Component({
  selector: 'app-finished',
  templateUrl: './finished.component.html',
  styleUrls: ['./finished.component.css']
})
export class FinishedComponent implements OnInit {

  constructor(
    public menuControl: MenuControlService,
    public user: UserService) { }

  ngOnInit(): void {
  }

}
