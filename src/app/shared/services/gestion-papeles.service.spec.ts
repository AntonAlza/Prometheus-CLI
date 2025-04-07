import { TestBed } from '@angular/core/testing';

import { GestionPapelesService } from './gestion-papeles.service';

describe('GestionPapelesService', () => {
  let service: GestionPapelesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionPapelesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
