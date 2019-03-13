import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: [
    './devices.component.css',
    './device_card_css/device-idle-time.component.css',
    './device_card_css/device-info.component.css',
    './device_card_css/device-issue-history.component.css',
    './device_card_css/device-on-off.component.css',
    './device_card_css/device-power.component.css'
  ]
})
export class DevicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
