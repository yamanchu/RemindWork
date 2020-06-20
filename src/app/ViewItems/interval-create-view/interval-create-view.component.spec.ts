import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalCreateViewComponent } from './interval-create-view.component';

describe('IntervalCreateViewComponent', () => {
  let component: IntervalCreateViewComponent;
  let fixture: ComponentFixture<IntervalCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
