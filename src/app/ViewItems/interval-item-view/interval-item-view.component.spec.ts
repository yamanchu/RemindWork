import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalItemViewComponent } from './interval-item-view.component';

describe('IntervalItemViewComponent', () => {
  let component: IntervalItemViewComponent;
  let fixture: ComponentFixture<IntervalItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntervalItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntervalItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
