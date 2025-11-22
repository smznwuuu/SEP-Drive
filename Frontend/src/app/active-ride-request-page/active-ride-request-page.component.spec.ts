import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRideRequestPageComponent } from './active-ride-request-page.component';

describe('AcitvRideRequestPageComponent', () => {
  let component: ActiveRideRequestPageComponent;
  let fixture: ComponentFixture<ActiveRideRequestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveRideRequestPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveRideRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
