import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Device} from "../../../model/device";

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.css']
})
export class DeviceCardComponent implements OnInit {

  @Input() device: Device;
  @Input() deviceCardStyle: String = "Large";
  deviceIssueState: boolean;

  @Input() selectedDevice: Device = null;

  @Input() location: string;

  @Output() uploaded = new EventEmitter<{device: Device, state: boolean}>();

  ngOnChanges(changes: SimpleChanges) {
    this.deviceIssueState = this.device.issues.reduce((prev, curr) => prev && curr.state, true);
  }

  emitDevicePower(device: Device, state: boolean) {
    this.uploaded.emit({device, state});
  }

  constructor() { }

  ngOnInit() {
    this.deviceIssueState = this.device.issues.reduce((prev, curr) => prev && curr.state, true);
  }

}
