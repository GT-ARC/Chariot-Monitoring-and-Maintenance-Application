import { Component, OnInit } from '@angular/core';

import {DevicepanelComponent} from "./devicepanel/devicepanel.component";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: [
    './devices.component.css',
    './device-card.component.css',
  ]
})
export class DevicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
