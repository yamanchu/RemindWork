import { TestBed } from '@angular/core/testing';

import { CreateIntervalService } from './create-interval.service';

describe('CreateIntervalService', () => {
  let service: CreateIntervalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateIntervalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
