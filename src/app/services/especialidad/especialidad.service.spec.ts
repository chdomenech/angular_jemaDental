import { TestBed } from '@angular/core/testing';

import { EspecialidadService } from './especialidad.service';

describe('EspecialidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EspecialidadService = TestBed.get(EspecialidadService);
    expect(service).toBeTruthy();
  });
});
