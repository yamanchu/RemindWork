import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuControlService } from 'src/app/ViewModels/menu-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    public menuControl: MenuControlService) { }

  ngOnInit() {
    this.menuControl.showSideMenu = false;
  }
}
