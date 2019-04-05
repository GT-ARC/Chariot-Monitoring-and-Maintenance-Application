import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../model/device";

@Component({
  selector: 'app-device-panel-issue-history',
  templateUrl: './device-panel-issue-history.component.html',
  styleUrls: [
    './device-panel-issue-history.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelIssueHistoryComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit() {
  }

  getIssues(): any {
    return this.device.issues.sort((a, b) => b.issue_date - a.issue_date).slice(0, 4)
  }
}
