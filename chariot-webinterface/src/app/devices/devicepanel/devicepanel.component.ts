import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css',
    './device_card_css/device-idle-time.component.css',
    './device_card_css/device-info.component.css',
    './device_card_css/device-issue-history.component.css',
    './device_card_css/device-on-off.component.css',
    './device_card_css/device-power.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  gaugeType = "arch";
  gaugeValue = 34;
  gaugeLabel = "kw";
  gaugeColor = "rgba(41, 114, 230, 1)";
  gaugeThick = 10;
  gaugeCap = "butt";

  constructor() { }

  ngOnInit() {
  }

}
