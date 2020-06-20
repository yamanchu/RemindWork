import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkItemViewComponent } from './work-item-view.component';

describe('WorkItemViewComponent', () => {
  let component: WorkItemViewComponent;
  let fixture: ComponentFixture<WorkItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
