import { TestBed } from '@angular/core/testing';

import { DriverRideRequestService } from './driver-ride-request.service';

describe('DriverRideRequestService', () => {
  let service: DriverRideRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverRideRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
