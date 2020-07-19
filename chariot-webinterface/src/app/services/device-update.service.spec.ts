import { TestBed } from '@angular/core/testing';

import { DeviceUpdateService } from './device-update.service';

describe('DeviceUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceUpdateService = TestBed.get(DeviceUpdateService);
    expect(service).toBeTruthy();
  });
});
