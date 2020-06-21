import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/ViewModels/user.service';
import { MenuControlService } from 'src/app/ViewModels/menu-control.service';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {

  constructor(
    public menuControl: MenuControlService,
    public user: UserService) { }

  ngOnInit(): void {
  }

}
