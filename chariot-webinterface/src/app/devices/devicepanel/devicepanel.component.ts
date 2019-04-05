import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange} from '@angular/core';

import { EventEmitter } from '@angular/core';

import {Device} from "../../../model/device";


@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  @Input() device: Device;
  public issueState: boolean;


  ngOnChanges(changes: SimpleChanges) {
      this.issueState = this.device.issues.reduce((acc, curr) => acc && curr.state, true)
  }


  @Output() uploaded = new EventEmitter<{device: Device, state: boolean}>();


  constructor() { }

  ngOnInit() {
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

  emitDevicePower(device: Device, state: boolean) {
    this.uploaded.emit({device, state});
  }
}
