import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import 'hammerjs';
import {MatSliderChange} from "@angular/material";

@Component({
  selector: 'app-device-panel-slider',
  templateUrl: './device-panel-slider.component.html',
  styleUrls: [
    './device-panel-slider.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelSliderComponent implements OnInit {

  @Input() property: {
    name: string
    value: {
      value: any;
      unit?: string;
      min_value?: any;
      max_value?: any;
    }
  };

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();

  constructor() { }

  ngOnInit() {
  }

  changeValue($event: MatSliderChange) {
    this.property.value.value = $event.value;
    this.uploaded.emit({property: this.property.name, state: $event.value});
  }
}
