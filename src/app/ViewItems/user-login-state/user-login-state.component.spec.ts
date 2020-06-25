import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginStateComponent } from './user-login-state.component';

describe('UserLoginStateComponent', () => {
  let component: UserLoginStateComponent;
  let fixture: ComponentFixture<UserLoginStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLoginStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
