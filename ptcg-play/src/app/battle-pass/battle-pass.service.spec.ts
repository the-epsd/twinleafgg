import { TestBed } from '@angular/core/testing';

import { BattlePassService } from './battle-pass.service';

describe('BattlePassService', () => {
  let service: BattlePassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattlePassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
