import { TestBed } from '@angular/core/testing';

import { PmNotificationReceiverService } from './pm-notification-receiver.service';

describe('ChariotServiceNotificationReceiverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PmNotificationReceiverService = TestBed.get(PmNotificationReceiverService);
    expect(service).toBeTruthy();
  });
});
