import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceUsageCardComponent } from './device-usage-card.component';

describe('DeviceUsageCardComponent', () => {
  let component: DeviceUsageCardComponent;
  let fixture: ComponentFixture<DeviceUsageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceUsageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceUsageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
