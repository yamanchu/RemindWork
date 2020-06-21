import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNaviMenuComponent } from './side-navi-menu.component';

describe('SideNaviMenuComponent', () => {
  let component: SideNaviMenuComponent;
  let fixture: ComponentFixture<SideNaviMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNaviMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNaviMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
