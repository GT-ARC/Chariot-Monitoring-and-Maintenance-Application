import {Component, OnInit, SimpleChange} from '@angular/core';

import {MockDataService} from "../services/mock-data.service";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: [
    './devices.component.css',
    './device-card.component.css',
  ]
})
export class DevicesComponent implements OnInit {

  floors: Floor[];
  locations: Location[];
  devices: Device[];

  selectedLocation: Location[] = [];
  visableDevices: Device[] = [];

  selectedDevice: Device = null;

  allDevicesOn: boolean = false;

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.getMockData();
    this.floors.map( floor => {
      for(let loc of floor.locations){
        if(Math.random() > 0.8)
          this.selectedLocation.push(loc);
      }
    })

    this.showVisableDevices();

    let selectDevice = Math.floor(Math.random() * this.visableDevices.length * 0.25);
    console.log(selectDevice);
    this.selectedDevice = this.visableDevices[selectDevice];
    console.log(this.selectedDevice);
  }

  locationSelected(location: Location) {
    let entry = this.selectedLocation.indexOf(location);
    console.log(location.devices + " " + entry);
    if(entry >= 0){
      this.selectedLocation.splice(entry, 1);
    } else {
      this.selectedLocation.push(location);
    }
    this.showVisableDevices();
  }

  showVisableDevices() : void {
    this.visableDevices = []
    this.selectedLocation.map(loc => {
      loc.devices.map(d => this.visableDevices.push(d))
    })
    this.allDevicesOn = this.visableDevices.reduce((acc, curr) =>  acc && curr.power_state, true);
  }

  changeDevicePowerState(device: Device, state: boolean){
    console.log(device, state)
    device.power_state = state;
    this.allDevicesOn = this.visableDevices.reduce((acc, curr) =>  acc && curr.power_state, true);
  }

  switchAllDevices(value : boolean) {
    this.allDevicesOn = value;
    if(value) {
      this.visableDevices.map(device => device.power_state = true)
    } else {
      this.visableDevices.map(device => device.power_state = false)
    }
  }

  someMethod(event) {
    console.log(event)
  }

  getMockData(): void {
    this.mockDataService.getFloor()
      .subscribe(data => {
        this.floors = data.floors;
        this.locations = data.locations;
        this.devices = data.devices;
      });
  }
}
