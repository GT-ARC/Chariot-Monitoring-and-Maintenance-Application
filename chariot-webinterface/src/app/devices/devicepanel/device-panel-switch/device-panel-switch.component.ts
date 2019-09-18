import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {Device, Property} from '../../../../model/device';
import {MatSidenav} from '@angular/material';
import {DeviceUpdateService} from '../../../services/device-update.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-device-panel-switch',
  templateUrl: './device-panel-switch.component.html',
  styleUrls: [
    './device-panel-switch.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelSwitchComponent implements OnInit {

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();
  cardName: string;

  @Input() property: Property;
  @Input() selectedProperty: Property;

  private currentDataReceiver: Observable<string>;

  constructor(private deviceUpdateService: DeviceUpdateService) { }

  ngOnInit() {
    this.cardName = this.property.name == undefined ? this.property.key : this.property.name;
    this.receiveDataStream();
  }

  private receiveDataStream() {
    if(this.property.topic != '') {
      this.currentDataReceiver = this.deviceUpdateService.subscribeToTopic(this.property.topic);

      this.currentDataReceiver.subscribe(message => {
        //console.log(message);
        let property = JSON.parse(JSON.parse(message));
        // console.log("switch: ", property);
        if(property.value == 0) {
          this.property.value = false;
        } if(property.value == 1) {
          this.property.value = true;
        }
      });
    }
  }

  emitDevicePower(switchState: any) {
    // console.log(this.property);
    this.uploaded.emit({property: this.property.key, state: switchState});
  }

}
