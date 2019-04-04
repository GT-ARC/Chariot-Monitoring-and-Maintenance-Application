import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../model/device";

@Component({
  selector: 'app-device-panel-switch',
  templateUrl: './device-panel-switch.component.html',
  styleUrls: [
    './device-panel-switch.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelSwitchComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit() {
  }

}
