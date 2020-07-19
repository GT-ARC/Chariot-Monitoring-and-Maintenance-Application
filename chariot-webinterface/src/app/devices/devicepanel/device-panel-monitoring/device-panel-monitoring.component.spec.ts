import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelMonitoringComponent } from './device-panel-monitoring.component';

describe('DevicePanelMonitoringComponent', () => {
  let component: DevicePanelMonitoringComponent;
  let fixture: ComponentFixture<DevicePanelMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
