import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange} from '@angular/core';

import { Color, BaseChartDirective, Label } from 'ng2-charts';
import {Device} from "../../../../model/device";

@Component({
  selector: 'app-device-panel-monitoring',
  templateUrl: './device-panel-monitoring.component.html',
  styleUrls: [
    './device-panel-monitoring.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelMonitoringComponent implements OnInit {

  @Input() device: Device;
  dataAmount: number = 100;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.dataAmount = this.device.data.length;
  }

  ngOnInit() {
  }

  applyData(value: string) {
    this.dataAmount = Number(value);
  }
}
