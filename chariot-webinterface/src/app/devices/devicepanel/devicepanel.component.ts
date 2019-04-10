import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange} from '@angular/core';

import { EventEmitter } from '@angular/core';

import {Device} from "../../../model/device";
import {log} from "util";


@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  @Input() device: Device;
  @Output() uploaded = new EventEmitter<{device: Device, state: any}>();
  public issueState: boolean;

  ngOnChanges(changes: SimpleChanges) {
      this.issueState = this.device.issues.reduce((acc, curr) => acc && curr.state, true)
  }

  constructor() { }

  ngOnInit() {
  }

  emitDeviceProperty(property: string, state: any){
    if (property == "device_power")
      this.uploaded.emit({device: this.device, state});
    else {
      log(property, state);
      log(this.device.properties.find(value => value.name == property));
    }
  }

  getStyleOfCard(index: number){

    if(this.device.properties.length == 4)
      return '450px';

    let currentSegment = this.device.properties.slice(Math.floor(index/3), 3);
    if(currentSegment.length == 3)
      return '300px';
    else if(currentSegment.length == 2)
      return '450px';
    else return '900px';
  }

}
