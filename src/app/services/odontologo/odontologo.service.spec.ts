import { TestBed } from '@angular/core/testing';

import { OdontologoService } from './odontologo.service';

describe('OdontologoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OdontologoService = TestBed.get(OdontologoService);
    expect(service).toBeTruthy();
  });
});
