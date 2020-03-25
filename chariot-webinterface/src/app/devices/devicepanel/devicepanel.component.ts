import {Component, OnInit, Input, Output, SimpleChanges, OnDestroy, HostListener} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Device, Property, PropertyBundle} from '../../../model/device';
import {DeviceUpdateService} from '../../services/device-update.service';
import {AgentUpdateService} from '../../services/agent-update.service';
import {timer} from "rxjs";
import {mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  @Input() device: Device;
  @Output() uploaded = new EventEmitter<{ device: Device, state: any }>();

  deviceStatus: Property = null;

  arrayProperties: PropertyBundle[];
  normalProperties: PropertyBundle;
  selectedProperty: Property = null;
  private reloadInterval: number = 5000;
  private minInterval: number = 2000;
  private intervalIds = [];

  ngOnChanges(changes: SimpleChanges) {
    console.log("Selected device changed", changes);
    console.log("Selected device changed", this.device);
    console.log("Selected device changed", this.device.getIssueID());


    // Get the array properties and normal properties
    this.arrayProperties = this.getArrayProperties();
    this.normalProperties = this.getNormalProperties();

    // Select the first normal property
    if(this.normalProperties.properties.length > 0)
      this.selectedProperty = this.normalProperties.properties[0];

    // Set the device status property
    this.deviceStatus = this.device.properties.find(ele => ele.key === "status");

    this.startDummyDataStream(this.device);
  }

  constructor(private deviceUpdateService: DeviceUpdateService,
              private proxyAgent: AgentUpdateService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log("Unsubscribe everything");
    this.deviceUpdateService.unSubscribeDevice();
  }

  emitDeviceProperty(property: string, state: any) {
      this.device.properties.find(s => s.key == property).value = state;
      if(property == "status") this.uploaded.emit({device: this.device, state: state});

      this.proxyAgent.sendUpdate(this.device.identifier, property, state);
  }

  getArrayProperties() : PropertyBundle[] {
    let retBundle = [];
    for(let propBundle of this.device.properties.filter(value => value.type === 'Array')) {
      // @ts-ignore
      let bundledProp = new PropertyBundle(propBundle.value, this.device, propBundle);
      retBundle.push(bundledProp);
    }
    return retBundle;
  }

  getNormalProperties() {
    return new PropertyBundle(
      this.device.properties.filter(value => value.type !== 'Array' && value.key != 'status' && value.key != 'pm_result'),
      this.device,
      undefined);
  }

  private startDummyDataStream(device: Device) {
    device.properties.forEach(p => {
      p.updateListener = new EventEmitter<{
        y: number,
        x: number
      }>();
        if ( p.type != 'number')
          return;
        let internVal = Math.random() * this.reloadInterval + this.minInterval;
        let intervalID = setInterval(function () {
          let lastData = p.data[p.data.length - 1];
          p.value = lastData.y + (Math.random() - 0.5) * 10;
          let newDataPoint = {
            x: Date.now(),
            y: p.value
          };
          p.data.push(newDataPoint);
          p.updateListener.emit(newDataPoint);
        }, internVal);
        this.intervalIds.push(intervalID);
      }
    );
  }
}
