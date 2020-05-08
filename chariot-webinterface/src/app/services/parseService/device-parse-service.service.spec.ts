import { TestBed } from '@angular/core/testing';

import { DeviceParseService } from './device-parse.service';

describe('DeviceParseServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceParseService = TestBed.get(DeviceParseService);
    expect(service).toBeTruthy();
  });
});
