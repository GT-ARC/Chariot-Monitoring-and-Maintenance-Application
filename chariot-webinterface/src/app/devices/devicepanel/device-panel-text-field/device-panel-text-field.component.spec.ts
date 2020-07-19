import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelTextFieldComponent } from './device-panel-text-field.component';

describe('DevicePanelTextFieldComponent', () => {
  let component: DevicePanelTextFieldComponent;
  let fixture: ComponentFixture<DevicePanelTextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
