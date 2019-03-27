import { Component, OnInit } from '@angular/core';
import {MockDataService} from "../services/mock-data.service";
import {Floor} from "../../model/floor";
import {Location} from "../../model/location";
import {Device} from "../../model/device";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  floors: Floor[];        // Holds the fetched data of the floors
  locations: Location[];  // Holds the fetched data of the locations
  devices: Device[];      // Holds the fetched data of the devices

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.getMockData();
  }

  getMockData(): void {
    this.mockDataService.getFloor()
      .subscribe(data => {
        this.floors = data.floors;
        this.locations = data.locations;
        this.devices = data.devices;
      });
  }

  changeDevicePowerState(device: Device, state: boolean) {
    device.power_state = state
  }
}
