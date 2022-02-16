import { TestBed } from '@angular/core/testing';

import { IndexSwapService } from './index-swap.service';

describe('IndexSwapService', () => {
  let service: IndexSwapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexSwapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
