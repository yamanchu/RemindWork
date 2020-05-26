import { TestBed } from '@angular/core/testing';

import { MenuControlService } from './menu-control.service';

describe('MenuControlService', () => {
  let service: MenuControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
