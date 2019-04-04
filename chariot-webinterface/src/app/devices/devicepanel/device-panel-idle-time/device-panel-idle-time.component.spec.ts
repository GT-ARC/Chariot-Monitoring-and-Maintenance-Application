import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelIdleTimeComponent } from './device-panel-idle-time.component';

describe('DevicePanelIdleTimeComponent', () => {
  let component: DevicePanelIdleTimeComponent;
  let fixture: ComponentFixture<DevicePanelIdleTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelIdleTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelIdleTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
