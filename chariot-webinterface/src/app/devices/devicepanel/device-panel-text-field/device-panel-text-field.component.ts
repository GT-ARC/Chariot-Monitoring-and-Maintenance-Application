import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-device-panel-text-field',
  templateUrl: './device-panel-text-field.component.html',
  styleUrls: [
    './device-panel-text-field.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelTextFieldComponent implements OnInit {

  @Input() property: {
    name: string
    value: {
      value: any;
      unit?: string;
      min_value?: any;
      max_value?: any;
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
