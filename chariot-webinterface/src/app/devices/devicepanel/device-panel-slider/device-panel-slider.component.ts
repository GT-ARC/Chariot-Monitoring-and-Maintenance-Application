import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import 'hammerjs';
import {MatSliderChange} from '@angular/material';
import {isNumber} from 'util';
import {Property} from '../../../../model/device';

@Component({
  selector: 'app-device-panel-slider',
  templateUrl: './device-panel-slider.component.html',
  styleUrls: [
    './device-panel-slider.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelSliderComponent implements OnInit {

  @Input() property: Property;
  @Input() selectedProperty: Property;

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();
  public accuracy = 2;
  math = Math;

  constructor() { }

  ngOnInit() {
    if (this.property.value.toString().indexOf('.') === -1) {
      this.accuracy = 0;
    }
  }

  changeValue($event: MatSliderChange) {
    this.property.value = $event.value;
    this.uploaded.emit({property: this.property.key, state: $event.value});
  }

  emitValue(value: any) {
    if(value != this.property.value)
      this.uploaded.emit({property: this.property.name, state: value});
  }

  applyValueChange(value: any) {
    if(!isNaN(Number(value))){
      if(Number(value) <= this.property.max_value && Number(value) >= this.property.min_value){
        this.emitValue(Number(value));
        this.property.value = value;
      }
    }
  }
}
