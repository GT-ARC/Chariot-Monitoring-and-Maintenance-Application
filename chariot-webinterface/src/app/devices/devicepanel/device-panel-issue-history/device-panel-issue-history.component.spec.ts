import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePanelIssueHistoryComponent } from './device-panel-issue-history.component';

describe('DevicePanelIssueHistoryComponent', () => {
  let component: DevicePanelIssueHistoryComponent;
  let fixture: ComponentFixture<DevicePanelIssueHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePanelIssueHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePanelIssueHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
