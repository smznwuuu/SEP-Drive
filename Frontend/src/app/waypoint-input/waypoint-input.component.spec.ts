import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointInputComponent } from './waypoint-input.component';

describe('WaypointInputComponent', () => {
  let component: WaypointInputComponent;
  let fixture: ComponentFixture<WaypointInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaypointInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaypointInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
