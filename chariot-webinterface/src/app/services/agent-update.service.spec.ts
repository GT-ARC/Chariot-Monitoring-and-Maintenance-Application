import { TestBed } from '@angular/core/testing';

import { AgentUpdateService } from './agent-update.service';

describe('AgentUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgentUpdateService = TestBed.get(AgentUpdateService);
    expect(service).toBeTruthy();
  });
});
