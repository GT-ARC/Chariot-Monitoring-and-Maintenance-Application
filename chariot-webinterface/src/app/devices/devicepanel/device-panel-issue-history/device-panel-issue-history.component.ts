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
    if(this.device.issues) {
      return this.device.issues.sort((a, b) => b.issue_date - a.issue_date).slice(0, 4);
    }
    else
      return [];
  }

  getHeight() {
    if (!this.device.issues || this.device.issues.length <= 1 ) return "0px";
    if (this.device.issues.length == 2) return '79px';
    if (this.device.issues.length == 3) return '141px';
    return '200px';
  }

  getDate(issue_date: any) {
    let date = new Date(issue_date);
    return date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " "
      + this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(), 2)
  }

  pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
