import {Component, OnInit, SimpleChange} from '@angular/core';

import {MockDataService} from "../services/mock-data.service";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";
import {el} from "@angular/platform-browser/testing/src/browser_util";

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

  selectedLocation: string[] = [];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.getMockData();
  }

  locationSelected(location: Location) {
    let entry = this.selectedLocation.indexOf(location.identifier);
    if(entry >= 0){
      this.selectedLocation.splice(entry, 1);
    } else {
      this.selectedLocation.push(location.identifier);
    }
  }

  getMockData(): void {
    this.mockDataService.getFloor()
      .subscribe(data => {
        this.floors = data.floors;
        this.locations = data.locations;
        this.devices = data.devices;
      })
  }

}
