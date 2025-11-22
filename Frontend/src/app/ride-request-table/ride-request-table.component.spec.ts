import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRequestTableComponent } from './ride-request-table.component';

describe('RideRequestTableComponent', () => {
  let component: RideRequestTableComponent;
  let fixture: ComponentFixture<RideRequestTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideRequestTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
