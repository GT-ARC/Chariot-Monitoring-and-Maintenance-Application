import { Component, OnInit, Input, Output} from '@angular/core';

import {Location} from "../../../model/location";
import {Device} from "../../../model/device";
import {Floor} from "../../../model/floor";
import {Issue} from "../../../model/issue";

import {DevicesComponent} from "../devices.component"
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css',
    './device_card_css/device-idle-time.component.css',
    './device_card_css/device-info.component.css',
    './device_card_css/device-issue-history.component.css',
    './device_card_css/device-on-off.component.css',
    './device_card_css/device-power.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  @Input() device: Device;

  @Output() uploaded = new EventEmitter<{device: Device, state: boolean}>();

  math = Math

  constructor() { }

  ngOnInit() {
  }

  getIssues(): any {
    return this.device.issues.slice(0, 4)
  }

  emitDevicePower(device: Device, state: boolean) {
    this.uploaded.emit({device, state});
  }

  gaugeType = "arch";
  gaugeLabel = "kw";
  gaugeColor = "rgba(41, 114, 230, 1)";
  gaugeThick = 10;
  gaugeCap = "butt";
}
