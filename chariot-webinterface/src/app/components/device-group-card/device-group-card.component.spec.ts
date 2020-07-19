import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceGroupCardComponent } from './device-group-card.component';

describe('DeviceGroupCardComponent', () => {
  let component: DeviceGroupCardComponent;
  let fixture: ComponentFixture<DeviceGroupCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceGroupCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceGroupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
