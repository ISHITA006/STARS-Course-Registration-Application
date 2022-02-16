import { TestBed } from '@angular/core/testing';

import { PrintTimetableService } from './print-timetable.service';

describe('PrintTimetableService', () => {
  let service: PrintTimetableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintTimetableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
