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

  cardName: string;

  @Input() property: {
    name: string
    value: {
      value: any;
      min_value?: any;
      max_value?: any;
    }
  };

  constructor() { }

  ngOnInit() {
    this.cardName = this.device == null ? this.property.name : 'switch on/off';
  }

}
