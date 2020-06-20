import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectAreaDialogComponent } from './subject-area-dialog.component';

describe('SubjectAreaDialogComponent', () => {
  let component: SubjectAreaDialogComponent;
  let fixture: ComponentFixture<SubjectAreaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectAreaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectAreaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
