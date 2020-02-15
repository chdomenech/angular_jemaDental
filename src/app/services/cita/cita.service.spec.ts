import { TestBed } from '@angular/core/testing';

import { CitaService } from './cita.service';

describe('CitaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CitaService = TestBed.get(CitaService);
    expect(service).toBeTruthy();
  });
});
