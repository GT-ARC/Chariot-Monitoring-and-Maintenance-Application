import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicepanelComponent } from './devicepanel.component';

describe('DevicepanelComponent', () => {
  let component: DevicepanelComponent;
  let fixture: ComponentFixture<DevicepanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
