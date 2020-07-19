import { TestBed } from '@angular/core/testing';

import { DataHandlingService } from './data-handling.service';

describe('MockDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataHandlingService = TestBed.get(DataHandlingService);
    expect(service).toBeTruthy();
  });
});
