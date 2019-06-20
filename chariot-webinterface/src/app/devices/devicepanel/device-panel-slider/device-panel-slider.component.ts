import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import 'hammerjs';
import {MatSliderChange} from '@angular/material';
import {isNumber} from 'util';

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
  public accuracy = 2;
  math = Math;

  constructor() { }

  ngOnInit() {
    if (this.property.value.value.toString().indexOf('.') === -1) {
      this.accuracy = 0;
    }
  }

  changeValue($event: MatSliderChange) {
    this.property.value.value = $event.value;
    this.uploaded.emit({property: this.property.name, state: $event.value});
  }

  emitValue(value: any) {
    if(value != this.property.value.value)
      this.uploaded.emit({property: this.property.name, state: value});
  }

  applyValueChange(value: any) {
    if(!isNaN(Number(value))){
      if(Number(value) <= this.property.value.max_value && Number(value) >= this.property.value.min_value){
        this.emitValue(Number(value));
        this.property.value.value = value;
      }
    }
  }
}
