import { TestBed } from '@angular/core/testing';

import { AutoLoginGuard } from './auth-login.guard';

describe('AuthLoginGuard', () => {
  let guard: AutoLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutoLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
