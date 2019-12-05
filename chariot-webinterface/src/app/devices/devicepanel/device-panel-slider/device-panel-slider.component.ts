import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import 'hammerjs';
import {MatSliderChange} from '@angular/material';
import {isNumber} from 'util';
import {Device, Property} from '../../../../model/device';
import {Observable} from 'rxjs';
import {DeviceUpdateService} from '../../../services/device-update.service';

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

  private currentDataReceiver: Observable<string>;

  constructor(private deviceUpdateService: DeviceUpdateService) { }

  ngOnInit() {
    if (this.property.value.toString().indexOf('.') === -1) {
      this.accuracy = 0;
    }
    // console.log("Init", this.property);
    this.receiveDataStream();
  }

  private receiveDataStream() {
    if(this.property.topic != '') {
      this.currentDataReceiver = this.deviceUpdateService.subscribeToTopic(this.property.topic);
      // console.log(this.currentDataReceiver);
      this.currentDataReceiver.subscribe(message => {
        let property = JSON.parse(JSON.parse(message));
        // console.log(this.property.key, property.value);
        this.property.value = property.value * 1;
      });
    }
  }

  changeValue($event: MatSliderChange) {
    this.property.value = $event.value;
    this.property.data.push({x: new Date().getTime(), y: $event.value});
    this.uploaded.emit({property: this.property.key, state: $event.value});
  }

  emitValue(value: any) {
    if(value != this.property.value)
      this.uploaded.emit({property: this.property.key, state: value});
  }

  applyValueChange(value: any) {
    if(!isNaN(Number(value))){
      if(Number(value) <= this.property.max_value && Number(value) >= this.property.min_value){
        this.emitValue(Number(value));
        this.property.value = value;
      }
    }
  }

  ngOnDestroy() {
    this.deviceUpdateService.unSubscribeOfTopic(this.property.topic);
  }
}
