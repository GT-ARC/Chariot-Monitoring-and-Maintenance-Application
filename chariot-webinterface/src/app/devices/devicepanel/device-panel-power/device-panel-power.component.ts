import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../model/device";

@Component({
  selector: 'app-device-panel-power',
  templateUrl: './device-panel-power.component.html',
  styleUrls: [
    './device-panel-power.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelPowerComponent implements OnInit {

  @Input() device: Device;
  @Input() value: number;

  /** Gauge data **/
  gaugeType = "arch";
  gaugeLabel = "kw";
  gaugeColor = "rgba(41, 114, 230, 1)";
  gaugeThick = 10;
  gaugeCap = "butt";
  power_state: boolean = true;

  constructor() { }

  ngOnChange() {
    if(this.device != null) {
      this.power_state = <boolean> this.device.properties.find(s => s.key == "status").value;
    }
  }

  ngOnInit() {

  }

}
