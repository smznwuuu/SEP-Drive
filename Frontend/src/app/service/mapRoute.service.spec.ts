import { TestBed } from '@angular/core/testing';

import { MapRouteService } from './mapRoute.service';

describe('RouteService', () => {
  let service: MapRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
