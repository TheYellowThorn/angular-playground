import { TestBed } from '@angular/core/testing';

import { IcosahedronUtilsService } from './icosahedron-utils.service';

describe('IcosahedronUtilsService', () => {
  let service: IcosahedronUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcosahedronUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
