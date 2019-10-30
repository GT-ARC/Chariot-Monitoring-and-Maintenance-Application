import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {Device, Property} from '../../../../model/device';
import {MatSidenav} from '@angular/material';
import {DeviceUpdateService} from '../../../services/device-update.service';
import {Observable} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {RestService} from '../../../services/rest.service';

@Component({
  selector: 'app-device-panel-switch',
  templateUrl: './device-panel-switch.component.html',
  styleUrls: [
    './device-panel-switch.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelSwitchComponent implements OnInit {

  @Input() device: Device;

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();
  cardName: string;

  @Input() property: Property;
  @Input() selectedProperty: Property;

  private currentDataReceiver: Observable<string>;

  constructor (
    private deviceUpdateService: DeviceUpdateService,
    private notifierService: NotifierService,
    private restService : RestService
  ) { }

  ngOnInit() {
    this.cardName = this.property.name == undefined ? this.property.key : this.property.name;
    if (this.property.key == "pm_result") {
      if (this.property.url != undefined){
        this.restService.getHistoryData(this.property.url).subscribe(regData => {
          if(regData.hasOwnProperty("value")) {
            let historyData: {x: number, y: any}[] = regData['value'];
            let prevPoint = 0;
            for (let point of historyData) {
              if (prevPoint == 0 && point.y == 1) {
                // Issue detected
                this.device.addIssue(point.x);
              } else if (prevPoint == 1 && point.y == 0) {
                this.device.resolveLastIssue();
              }
              prevPoint = point.y;
            }
          }
        });
      }
    }

    this.receiveDataStream();
  }

  private receiveDataStream() {
    if(this.property.topic != '') {
      this.currentDataReceiver = this.deviceUpdateService.subscribeToTopic(this.property.topic);

      this.currentDataReceiver.subscribe(message => {
        //console.log(message);
        let property = JSON.parse(JSON.parse(message));
        // console.log("switch: ", property);
        // Check for pm result
        if (this.property.key == "pm_result") {
          if (this.property.value == 0 && property.value == 1) {
            // Issue detected
            this.device.addIssue();
            this.notifierService.notify('error', 'Issue detected');
          } else if (this.property.value == 1 && property.value == 0) {
            this.device.resolveLastIssue();
            this.notifierService.notify('success', 'Issue resolved');
          }
        }

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
