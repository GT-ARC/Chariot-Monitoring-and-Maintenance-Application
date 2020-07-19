import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelSliderComponent } from './device-panel-slider.component';

describe('DevicePanelSliderComponent', () => {
  let component: DevicePanelSliderComponent;
  let fixture: ComponentFixture<DevicePanelSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
