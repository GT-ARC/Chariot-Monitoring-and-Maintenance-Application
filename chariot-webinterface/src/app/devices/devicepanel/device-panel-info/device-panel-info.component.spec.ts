import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelInfoComponent } from './device-panel-info.component';

describe('DevicePanelInfoComponent', () => {
  let component: DevicePanelInfoComponent;
  let fixture: ComponentFixture<DevicePanelInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
