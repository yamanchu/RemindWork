import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateWorkService {
  addMode = false;
  addScroll = false;

  constructor() { }
}
