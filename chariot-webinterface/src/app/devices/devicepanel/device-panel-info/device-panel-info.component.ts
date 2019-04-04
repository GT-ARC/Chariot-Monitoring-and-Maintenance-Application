import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../model/device";

@Component({
  selector: 'app-device-panel-info',
  templateUrl: './device-panel-info.component.html',
  styleUrls: [
    './device-panel-info.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelInfoComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit() {
  }

}
