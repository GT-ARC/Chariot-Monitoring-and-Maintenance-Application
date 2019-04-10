import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() uploaded = new EventEmitter<{property: string, state: any}>();
  cardName: string;

  @Input() property: {
    name: string
    value: {
      value: any;
      min_value?: any;
      max_value?: any;
    }
  };

  emitDevicePower(switchState: any) {
    if (this.device == null)
      this.uploaded.emit({property: this.property.name, state: switchState});
    else
      this.uploaded.emit({property: "device_power", state: switchState});

  }

  constructor() { }

  ngOnInit() {
    this.cardName = this.device == null ? this.property.name : 'switch on/off';
  }

}
