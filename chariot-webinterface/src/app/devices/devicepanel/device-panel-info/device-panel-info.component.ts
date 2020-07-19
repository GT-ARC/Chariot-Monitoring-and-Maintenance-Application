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

  isURL(str) {
    let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    let pattern = new RegExp(expression);
    return pattern.test(str);
  }

}
