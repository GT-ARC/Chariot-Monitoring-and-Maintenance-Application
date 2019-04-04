import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../model/device";


@Component({
  selector: 'app-device-panel-idle-time',
  templateUrl: './device-panel-idle-time.component.html',
  styleUrls: [
    './device-panel-idle-time.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelIdleTimeComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit() {
  }

}
