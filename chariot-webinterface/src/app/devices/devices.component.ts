import {Component, OnInit, SimpleChange} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location as Locl} from '@angular/common';

import {MockDataService} from "../services/mock-data.service";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: [
    './devices.component.css'
  ]
})
export class DevicesComponent implements OnInit {

  floors: Floor[];        // Holds the fetched data of the floors
  locations: Location[];  // Holds the fetched data of the locations
  devices: Device[];      // Holds the fetched data of the devices

  selectedFloors: Floor[] = [];       // Floors where all locations are selected
  selectedLocation: Location[] = [];  // Locations which devices should be visible

  visibleLocation: {} = {};      // Map of floors to filtered locations
  visibleDevices: Device[] = []; // Array of displays to be displayed

  overallIssueCounter: number = 0;
  floorIssues: {} = {};
  locationIssues: {} = {};
  deviceIssues: {} = {};

  selectedDevice: Device = null; // Currently selected device

  // Connected to model switches
  allLocationsSelected: boolean = false;
  allDevicesOn: boolean = false;

  // The device filter
  deviceFilter: String = "";

  floorSort: string[] = ["Number of devices", "Number of errors", "Level", "Type of room"];
  floorSortSelected: String = "Level";

  deviceSort: string[] = ["Name", "Date", "Device type", "On/Off"];
  deviceSortSelected: String = "On/Off";

  deviceCardStyle: string = "Large";

  constructor(
    private route: ActivatedRoute,
    private mockDataService: MockDataService,
    private locationService: Locl
  ) {}

  ngOnInit() {
    let id = null;
    if(this.route.snapshot.paramMap.has('id'))
      id = +this.route.snapshot.paramMap.get('id');
    this.getMockData();

    let selectDevice = null;
    if (id != null) {
      selectDevice = this.devices.find(value => value.identifier == id);
      if(selectDevice == undefined)
        id = null;
      else
        this.selectedDevice = selectDevice;
    }

    this.floors.forEach(floor => {
      for (let loc of floor.locations) {
        if (loc.devices.indexOf(selectDevice) != -1)
          this.selectedLocation.push(loc);
        else if (Math.random() > 0.8)
          this.selectedLocation.push(loc);
      }
    });
    if (this.selectedLocation.length == 0)
      this.selectedLocation.push(this.locations[0]);

    this.floors.forEach(f => this.visibleLocation[f.identifier] = f.locations);
    this.updateUI();

    if (id == null){
      selectDevice = Math.floor(Math.random() * this.visibleDevices.length * 0.25);
      this.selectedDevice = this.visibleDevices[selectDevice];
    }


    this.devices.forEach(d =>
      this.deviceIssues[d.identifier] = {
        state: d.issues.reduce((prev, curr) => prev && curr.state, true),
        amount: d.issues.reduce((prev, curr) => prev + (curr.state ? 0 : 1), 0)
      }
    );

    this.locations.forEach( l =>
      this.locationIssues[l.identifier] = l.devices.map(d => this.deviceIssues[d.identifier].amount)
        .reduce((c,n) => c + n, 0)
    );

    this.floors.forEach( f =>
      this.floorIssues[f.identifier] = f.locations.map(l => this.locationIssues[l.identifier])
        .reduce((c,n) => c + n, 0)
    );

    this.overallIssueCounter = this.floors.map(f => this.floorIssues[f.identifier]).reduce((c, n) => c + n, 0);

  }

  /**
   * Depending on selected locations and device filter
   * view visible devices
   */
  showVisibleDevices(): void {
    this.visibleDevices = [];
    this.selectedLocation.map(loc => {
      loc.devices.filter(d =>
        d.name.toLocaleLowerCase().indexOf(this.deviceFilter.toLocaleLowerCase()) > -1
      ).map(d => this.visibleDevices.push(d))
    });
    this.visibleDevices.sort(((a, b) => {
      switch (this.deviceSortSelected) {
        case "Name":
          return a.identifier - b.identifier;
        case "Date":
          return a.identifier - b.identifier;
        case "Device type":
          return a.identifier - b.identifier;
        case "On/Off":
          if(a.power_state == b.power_state)
            return a.identifier - b.identifier;
          else
            if(a.power_state == true)
              return 0;
          return 1;
      }
    }));
    this.allDevicesOn = this.visibleDevices.reduce((acc, curr) => acc && curr.power_state, true);
  }

  /**
   * Changes the power state of the selected device
   * @param device
   * @param state
   */
  changeDevicePowerState(device: Device, state: boolean) {
    device.power_state = state;
    this.allDevicesOn = this.visibleDevices.reduce((acc, curr) => acc && curr.power_state, true);
    // this.showVisibleDevices();
  }

  /**
   * Switch that controls the power state of all visible devices
   * @param state The state of the switch
   */
  switchAllDevices(state: boolean) {
    this.allDevicesOn = state;
    if (state) {
      this.visibleDevices.map(device => device.power_state = true)
    } else {
      this.visibleDevices.map(device => device.power_state = false)
    }
    this.showVisibleDevices();
  }

  /**
   * Retrieves the mock data from the mock data service
   */
  getMockData(): void {
    this.mockDataService.getFloor()
      .subscribe(data => {
        this.floors = data.floors;
        this.locations = data.locations;
        this.devices = data.devices;
      });
  }

  /**
   * Function that handles if a location is selected
   * @param location The location that has been selected
   * @param checked the sate it supposed to be
   */
  locationSelected(location: Location, checked: boolean) {
    let entry = this.selectedLocation.indexOf(location);
    if (checked) {
      if(entry < 0) this.selectedLocation.push(location);
    } else {
      this.selectedLocation.splice(entry, 1);
    }
    this.updateUI();
  }

  /**
   * Switches all rooms of @floor to visible
   * @param floor The selected floor
   * @param checked the state of the checkbox
   */
  floorSelected(floor: Floor, checked: boolean) {
    floor.locations.map(l => {
      this.locationSelected(l, checked)
    });
  }

  /**
   * Changes all rooms to visible
   * @param checked
   */
  viewAllLocations(checked: boolean) {
    if(checked){
      this.floors.map(floor => {
        this.floorSelected(floor, checked);
      });
    } else {
      this.selectedLocation = [];
      this.selectedFloors = [];
      this.visibleDevices = [];
      this.updateUI();
    }
  }

  /**
   * Checks if complete floors or all locations are selected
   * Updates the visible devices
   */
  private updateUI() {
    this.floors.map(f => {
      if ( f.locations.reduce((acc, loc) => acc && this.selectedLocation.indexOf(loc) >= 0, true)) {
        if(this.selectedFloors.indexOf(f) < 0) {
          this.selectedFloors.push(f);
        }
      } else {
        let entry = this.selectedFloors.indexOf(f);
        if(entry >= 0) this.selectedFloors.splice(entry, 1);
      }
    });

    this.allLocationsSelected = this.selectedFloors.length == this.floors.length;
    this.showVisibleDevices();
  }

  /**
   * Filters the visible floors
   * @param filterString
   */
  filterFloors(filterString: string) {
    // if(input.length != 0)
      this.floors.map( f => {
        this.visibleLocation[f.identifier] = f.locations.filter(l =>
          l.name.toLowerCase().indexOf(filterString.toLocaleLowerCase()) > -1
        )
      });
  }

  /**
   * Sets the device filter string
   * @param filterString
   */
  filterDevices(filterString: string) {
    this.deviceFilter = filterString;
    this.showVisibleDevices()
  }

  sortLocationList(sort_point: string) {
    this.floorSortSelected = sort_point;
    switch (sort_point) {
      case "Number of devices":
        this.floors.forEach(f => f.locations.sort((a, b) => b.devices.length - a.devices.length));
        break;
      case "Number of errors":
        this.floors.forEach(f => f.locations.sort((a, b) => this.locationIssues[b.identifier] - this.locationIssues[a.identifier]));
        break;
      case "Level":
        this.floors.forEach(f => f.locations.sort((a, b) => a.identifier - b.identifier));
        this.floors.sort((a,b) => a.level - b.level);
        break;
      case "Type of room":
        break;
    }
  }

  newDeviceSelected(device: Device) {
    this.selectedDevice = device;
    this.locationService.replaceState("/devices/" + device.identifier);
  }
}
