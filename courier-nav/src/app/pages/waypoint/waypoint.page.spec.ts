import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaypointPage } from './waypoint.page';

describe('WaypointPage', () => {
  let component: WaypointPage;
  let fixture: ComponentFixture<WaypointPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaypointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
