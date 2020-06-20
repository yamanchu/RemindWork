import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCreateViewComponent } from './work-create-view.component';

describe('WorkCreateViewComponent', () => {
  let component: WorkCreateViewComponent;
  let fixture: ComponentFixture<WorkCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
