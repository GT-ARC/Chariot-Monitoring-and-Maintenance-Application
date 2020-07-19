import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelSwitchComponent } from './device-panel-switch.component';

describe('DevicePanelSwitchComponent', () => {
  let component: DevicePanelSwitchComponent;
  let fixture: ComponentFixture<DevicePanelSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
