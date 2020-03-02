import { TestBed } from '@angular/core/testing';

import { CitaListService } from './cita-list.service';

describe('CitaListService', () => {
  let service: CitaListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
