import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Device, Property} from '../../../model/device';

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

  writable: boolean;
  statusProperty : Property;

  ngOnChanges(changes: SimpleChanges) {
    this.statusProperty = this.device.properties.find( s => s.key == 'status');
    if(this.statusProperty == undefined){
      console.log("status property is missing from the device model");
      this.writable = false;
      this.statusProperty = new Property(
        1572439237374,
        "boolean",
         "status",
         false,
         false,
    )
    } else
      this.writable = this.statusProperty.writable;
    this.getIssueState();
  }

  emitDevicePower(device: Device, state: boolean) {
    this.uploaded.emit({device, state});
  }

  getIssueState() {
    if(this.device.issues)
      this.deviceIssueState = this.device.issues.reduce((prev, curr) => prev && curr.state, true);
    else
      this.deviceIssueState = true;
  }

  constructor() { }

  ngOnInit() {
    this.getIssueState();
  }

}
