import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTestingComponent } from './settings-testing.component';

describe('SettingsTestingComponent', () => {
  let component: SettingsTestingComponent;
  let fixture: ComponentFixture<SettingsTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
