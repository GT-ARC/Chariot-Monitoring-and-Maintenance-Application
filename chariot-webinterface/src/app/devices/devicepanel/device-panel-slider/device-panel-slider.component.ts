import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import 'hammerjs';
import {MatSliderChange} from '@angular/material';

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
  public editMode: boolean;
  public tfWidth;
  public accuracy = 2;
  math = Math;

  constructor() { }

  ngOnInit() {
    this.tfWidth = this.getVisibleString(this.property.value.value).length * 26;
    if (this.property.value.value.toString().indexOf('.') === -1) {
      this.accuracy = 0;
    }
  }

  changeValue($event: MatSliderChange) {
    this.property.value.value = $event.value;
    this.uploaded.emit({property: this.property.name, state: $event.value});
  }

  emitValue(value: number) {
    this.uploaded.emit({property: this.property.name, state: value});
  }

  getVisibleString(value: number): string {
    const retValue =  Math.round(value * Math.pow(10, this.accuracy)) / Math.pow(10, this.accuracy);
    const retString = retValue.toString();
    if (retString.length - retString.indexOf('.') < this.accuracy) {
      retString.padEnd(retString.length - retString.indexOf('.') + this.accuracy, '0');
    }
    return retString;
  }

  tfWidthChange() {
    this.tfWidth = this.getVisibleString(this.property.value.value).length * 26;
  }

  submitValue($event: Event) {
    this.editMode = false;
    // @ts-ignore
    this.property.value.value = $event.target.value;
  }

  focusEvent($event: FocusEvent) {
    this.editMode = false;
  }

  textClicked() {
    this.editMode = true;
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      document.getElementById('input-field').focus();
    },0);
  }
}
