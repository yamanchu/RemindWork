import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNextNextToGoDialogComponent } from './select-next-next-to-go-dialog.component';

describe('SelectNextNextToGoDialogComponent', () => {
  let component: SelectNextNextToGoDialogComponent;
  let fixture: ComponentFixture<SelectNextNextToGoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectNextNextToGoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNextNextToGoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
