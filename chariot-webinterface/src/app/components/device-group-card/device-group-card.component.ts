import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeviceGroup} from '../../../model/deviceGroup';
import {Device} from '../../../model/device';

@Component({
  selector: 'app-device-group-card',
  templateUrl: './device-group-card.component.html',
  styleUrls: ['./device-group-card.component.css']
})
export class DeviceGroupCardComponent implements OnInit {

  @Input() device_group: DeviceGroup;

  @Output() device_group_selected = new EventEmitter<{device_group : DeviceGroup}>();

  deviceIssueState = false;
  visible = true;

  symbol: string;

  constructor() { }

  ngOnInit() {
    for(let device of this.device_group.devices)
      if(device.hasIssue() > 0)
        this.deviceIssueState = true;

    this.visible = this.device_group.visible;
    this.symbol = this.getSymbol();
  }

  hideDeviceGroup() {
    this.device_group.visible = !this.device_group.visible;
    this.visible = this.device_group.visible;
  }

  getSymbol() : string {
    switch(this.device_group.devices.length) {
      case 1: return "looks_one";
      case 2: return "looks_two";
      case 3: return "looks_3";
      case 4: return "looks_4";
      case 5: return "looks_5";
      case 6: return "looks_6";
    }
    return "flash_on"
  }

  newDeviceGroupSelected() {
    this.device_group_selected.emit({device_group: this.device_group});
  }
}
