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
  }

  emitDevicePower(device: Device, state: boolean) {
    this.uploaded.emit({device, state});
  }


  constructor() { }

  ngOnInit() { }

}
