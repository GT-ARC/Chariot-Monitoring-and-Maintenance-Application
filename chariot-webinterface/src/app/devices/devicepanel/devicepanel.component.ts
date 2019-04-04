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


  emitDevicePower(device: Device, state: boolean) {
    this.uploaded.emit({device, state});
  }
}
