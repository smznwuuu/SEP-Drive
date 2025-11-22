import { TestBed } from '@angular/core/testing';

import { RideOfferService } from './ride-offer.service';

describe('RideOfferService', () => {
  let service: RideOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
