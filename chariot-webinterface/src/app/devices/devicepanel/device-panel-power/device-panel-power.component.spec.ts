import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelPowerComponent } from './device-panel-power.component';

describe('DevicePanelPowerComponent', () => {
  let component: DevicePanelPowerComponent;
  let fixture: ComponentFixture<DevicePanelPowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelPowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
