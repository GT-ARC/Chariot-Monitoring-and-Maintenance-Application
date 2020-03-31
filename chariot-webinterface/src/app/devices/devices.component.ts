import {Component, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location as Locl} from '@angular/common';

import {DataHandlingService} from '../services/data-handling.service';

import {Location} from '../../model/location';
import {Device} from '../../model/device';
import {Floor} from '../../model/floor';
import {MatSidenav} from '@angular/material';
import {DeviceGroup} from '../../model/deviceGroup';
import {RestService} from '../services/rest.service';
import {strings} from "../../environments/strings";
import {Metadata} from "../../model/Metadata";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: [
    './devices.component.css'
  ]
})
export class DevicesComponent implements OnInit {

  floors: Floor[] = [];        // Holds the fetched data of the floors
  locations: Location[] = [];  // Holds the fetched data of the locations
  devices: Device[] = [];      // Holds the fetched data of the devices
  deviceGroups: DeviceGroup[] = [];      // Holds the fetched data of the devices

  selectedFloors: Floor[] = [];       // Floors where all locations are selected
  selectedLocation: Location[] = [];  // Locations which devices should be visible

  visibleLocation: {} = {};      // Map of floors to filtered locations
  visibleElements: (DeviceGroup | Device)[] = [];
  visibleDeviceGroups: DeviceGroup[] = []; // Array of displays to be displayed
  visibleDevice: Device[] = []; // Array of displays to be displayed

  overallIssueCounter: number = 0;
  floorIssues: {} = {};
  locationIssues: {} = {};   // Map for counting the issues per location
  deviceIssues: {} = {};
  deviceGroupIssues: {} = {};

  selectedDevice: Device = undefined; // Currently selected device
  selectedDeviceGroup: DeviceGroup = undefined; // Currently selected device

  deviceLocationMap: Map<Device | DeviceGroup, Location> = new Map<Device|DeviceGroup, Location>();

  // Connected to model switches
  allLocationsSelected: boolean = false;
  allDevicesOn: boolean = false;

  // The device filter
  deviceFilter: String = '';

  floorSort: string[] = [
    strings.floor_sort.level,
    strings.floor_sort.number_of_devices,
    strings.floor_sort.number_of_errors,
    strings.floor_sort.type_of_room,
  ];
  floorSortSelected: String = strings.floor_sort.level;

  deviceSort: string[] = [
    strings.device_sort.on_off,
    strings.device_sort.name,
    strings.device_sort.date,
    strings.device_sort.device_type,
  ];
  deviceSortSelected: String = strings.device_sort.on_off;

  deviceCardStyle: string = strings.device_card_style.small;

  routedId: string = undefined;

  window = window;

  strings = strings;

  @ViewChild('snav1', {static: false}) sideNav: MatSidenav;
  @ViewChild('snav2', {static: false}) sideNav2: MatSidenav;
  private metadata: Metadata;

  backDropClicked() {
    if (this.sideNav.opened && window.innerWidth < 1578) {
      this.sideNav.close();
    }

    if (this.sideNav2.opened && window.innerWidth < 1248) {
      this.sideNav2.close();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private dataService: DataHandlingService,
    private locationService: Locl,
  ) {
    // Receive updates on data change events
    dataService.getDataNotification().subscribe(next => {
      console.log("Device Update received");
      this.initInterface();
    });
  }

  ngOnInit() {
    // Get the mock data from the mock data service
    this.getData();
    this.initInterface();
  }

  resetDataStructures() {
    this.overallIssueCounter = 0;
    this.selectedDevice = undefined;
    this.floorIssues = {};
    this.locationIssues = {};   // Map for counting the issues per location
    this.deviceIssues = {};
    this.deviceGroupIssues = {};
    this.visibleLocation = {};
    this.selectedLocation = [];
    this.selectedFloors = [];
    this.visibleElements = [];
    this.visibleDeviceGroups = [];
    this.visibleDevice = [];
  }

  initInterface() {
    if (this.devices.length == 0 || this.locations.length == 0 || this.floors.length == 0)
      return;

    this.resetDataStructures();


    let routedElement = this.getRoutedDevice();
    // console.log("Routed element", routedElement);

    // Make the selected floor with the device group visible and push some random locations to be selected
    if (routedElement) {
      let location = this.deviceLocationMap.get(routedElement);
      if (location)
        this.selectedLocation.push(location);
    }


    // If by chance no location is selected, select the first
    if (this.selectedLocation.length == 0 && this.locations.length != 0) {
      this.selectedLocation.push(this.locations[0]);
    }

    // console.log("Device parent page: selected location:", this.selectedLocation, " locations ", this.locations);

    // Put all locations in the visible locations map
    this.floors.forEach(f => this.visibleLocation[f.identifier] = f.locations);
    this.updateUI();

    if (this.selectedDevice) {
      // console.log("Devices parent page: ", this.selectedDevice);
      // console.log("Devices parent page: ", this.selectedDevice.getIssueID());
    }

    // If the selected device is still undefined select a random visible device
    if (this.selectedDeviceGroup === undefined && this.selectedDevice === undefined) {
      let devicePos = Math.floor(Math.random() * this.visibleDeviceGroups.length * 0.25);
      this.newDeviceSelected(this.visibleDevice[devicePos]);
    }

    this.countTheIssues();

    // console.log("Devices", this.devices, "Selected Location", this.selectedLocation, "Visible stuff", this.visibleElements);
    // console.log("Visible Location", this.visibleLocation);
    // console.log("Devices parent page: ", this.selectedDevice);
    // console.log("Devices parent page: ", this.selectedDevice.getIssueID());
  }

  getRoutedDevice(): DeviceGroup | Device {
    // If a specific id is in the url route to the id
    this.routedId = undefined;
    if (this.route.snapshot.paramMap.has('id')) {
      this.routedId = this.route.snapshot.paramMap.get('id');
    }

    console.log("Routed ID: " + this.routedId);

    // Get the selected device
    if (this.routedId != undefined) {
      if (this.routedId.indexOf('g') == 0) {
        let tempID = this.routedId.slice(1);
        let selectDeviceGroup = this.deviceGroups.find(value => value.identifier == tempID);
        this.selectedDeviceGroup = selectDeviceGroup;
        if (selectDeviceGroup != undefined) {
          this.newDeviceGroupSelected(selectDeviceGroup);
          return selectDeviceGroup;
        }
      } else {
        let selectDevice = this.devices.find(value => value.identifier == this.routedId);
        if (selectDevice == undefined)
          return undefined;
        this.newDeviceSelected(selectDevice);
        return selectDevice;
      }
    }

    return undefined;
  }

  /**
   * Count the issues for each group
   */
  countTheIssues() {
    this.devices.forEach(d =>
      this.deviceIssues[d.identifier] = {
        state: d.issues.reduce((prev, curr) => prev && curr.state, true),
        amount: d.issues.reduce((prev, curr) => prev + (curr.state ? 0 : 1), 0)
      }
    );

    // Count the device issues per device group
    this.deviceGroups.forEach(dg =>
      this.deviceGroupIssues[dg.identifier] = dg.devices.map(d => this.deviceIssues[d.identifier] ? this.deviceIssues[d.identifier].amount : 0)
        .reduce((c, n) => c + n, 0)
    );

    // count the device issues per location
    this.locations.forEach(l =>
      this.locationIssues[l.identifier] =
        l.devices.map(d => this.deviceIssues[d.identifier] ? this.deviceIssues[d.identifier].amount : 0).reduce((c, n) => c + n, 0) +
        l.deviceGroups.map(dg => this.deviceGroupIssues[dg.identifier]).reduce((c, n) => c + n, 0)
    );

    this.floors.forEach(f =>
      this.floorIssues[f.identifier] = f.locations.map(l => this.locationIssues[l.identifier])
        .reduce((c, n) => c + n, 0)
    );

    this.overallIssueCounter = this.floors.map(f => this.floorIssues[f.identifier]).reduce((c, n) => c + n, 0);
  }

  /**
   * Depending on selected locations and device filter
   * view visible devices
   */
  showVisibleDevices(): void {
    this.visibleElements = [];
    this.visibleDeviceGroups = [];
    this.visibleDevice = [];

    // Go through each selected location and check if there is a device in the device group matching the filter string
    this.selectedLocation.forEach(loc => {
      for (let device_group of loc.deviceGroups) {
        for (let device of device_group.devices) {
          if (device.name.toLocaleLowerCase().indexOf(this.deviceFilter.toLocaleLowerCase()) > -1) {
            this.visibleElements.push(device_group);
            this.visibleDeviceGroups.push(device_group);
            break;
          }
        }
      }
      for (let device of loc.devices) {
        if (device.name.toLocaleLowerCase().indexOf(this.deviceFilter.toLocaleLowerCase()) > -1) {
          this.visibleElements.push(device);
          this.visibleDevice.push(device);
        }
      }
    });

    console.log(this.visibleElements);

    // Go through each visible device group and check which devices should be visible
    this.visibleDeviceGroups.forEach(dg =>
      dg.devices.forEach(d => {
        if (d.name.toLocaleLowerCase().indexOf(this.deviceFilter.toLocaleLowerCase()) > -1) {
          this.visibleDevice.push(d);
        }
      })
    );

    // TODO decide how to do the sorting

    // this.visibleDeviceGroups.sort(((a, b) => {
    //   switch (this.deviceSortSelected) {
    //     case "Name":
    //       return a.identifier - b.identifier;
    //     case "Date":
    //       return a.identifier - b.identifier;
    //     case "Device type":
    //       return a.identifier - b.identifier;
    //     case "On/Off":
    //       if(a.power_state == b.power_state)
    //         return a.identifier - b.identifier;
    //       else
    //         if(a.power_state == true)
    //           return 0;
    //       return 1;
    //   }
    // }));
    this.allDevicesOn = true;
    for (let element of this.visibleDevice) {
      if (element.properties.find(s => s.key == 'status').value == false) {
        this.allDevicesOn = false;
        break;
      }
    }
  }

  /**
   * Changes the power state of the selected device
   * @param device
   * @param state
   */
  changeDevicePowerState(device: Device, state: boolean) {
    console.log("Change power state of the device");
    let property = device.properties.find(s => s.key === "status");
    property.value = state;
    this.allDevicesOn = <boolean>this.visibleDeviceGroups.reduce((acc, curr) =>
      acc && curr.devices.reduce((acc, curr) => {
        let statusProperty = curr.properties.find(s => s.key === "status" && s.writable == true);
        if (statusProperty == undefined) return acc && true;
        else return acc && statusProperty.value;
      }, true), true);
    // this.showVisibleDevices();
  }

  /**
   * Switch that controls the power state of all visible devices
   * @param state The state of the switch
   */
  switchAllDevices(state: boolean) {
    this.allDevicesOn = state;
    if (state) {
      this.visibleDevice.forEach(device => {
        let prop = device.properties.find(s => s.key == 'status');
        if (prop.writable) prop.value = true;
      });
    } else {
      this.visibleDevice.forEach(device => {
        let prop = device.properties.find(s => s.key == 'status');
        if (prop.writable) prop.value = false;
      });
    }
  }

  /**
   * Retrieves the mock data from the mock data service
   */
  getData(): void {
    if (this.floors.length == 0) {
      this.dataService.getFloor()
        .subscribe(data => {
          this.floors = data.floors;
          this.locations = data.locations;
          this.devices = data.devices;
          this.deviceGroups = data.deviceGroup;

          // Fill the device location map
          this.locations.forEach(l => {
            l.devices.forEach(
              d => this.deviceLocationMap.set(d, l)
            );
            l.deviceGroups.forEach(
              dg => {
                dg.devices.forEach(d => this.deviceLocationMap.set(d, l));
                this.deviceLocationMap.set(dg, l);
              }
            );
          })
        });
    }
    this.dataService.getMetadata()
      .subscribe(data => {
        this.metadata = data.metaData;
      });
  }

  /**
   * Function that handles if a location is selected
   *
   * @param location The location that has been selected
   * @param checked the sate it supposed to be
   * @param updateUi if the ui should update after location selected
   */
  locationSelected(location: Location, checked: boolean, updateUi?: boolean) {
    if (updateUi == undefined)
      updateUi = true;
    let entry = this.selectedLocation.indexOf(location);
    if (checked) {
      if (entry < 0) {
        this.selectedLocation.push(location);
      }
    } else {
      this.selectedLocation.splice(entry, 1);
    }
    if (updateUi) this.updateUI();
  }

  /**
   * Switches all rooms of @floor to visible
   * @param floor The selected floor
   * @param checked the state of the checkbox
   */
  floorSelected(floor: Floor, checked: boolean) {
    floor.locations.forEach(l => {
      this.locationSelected(l, checked, false);
    });
    this.updateUI();
  }

  /**
   * Changes all rooms to visible
   * @param checked
   */
  viewAllLocations(checked: boolean) {
    if (checked) {
      this.floors.forEach(floor => {
        this.floorSelected(floor, checked);
      });
    } else {
      this.selectedLocation = [];
      this.selectedFloors = [];
      this.visibleElements = [];
      this.visibleDeviceGroups = [];
      this.visibleDevice = [];
      this.updateUI();
    }
  }

  /**
   * Checks if complete floors or all locations are selected
   * Updates the visible devices
   */
  private updateUI() {
    this.floors.forEach(f => {
      if (f.locations.reduce((acc, loc) => acc && this.selectedLocation.indexOf(loc) >= 0, true)) {
        if (this.selectedFloors.indexOf(f) < 0) {
          this.selectedFloors.push(f);
        }
      } else {
        let entry = this.selectedFloors.indexOf(f);
        if (entry >= 0) {
          this.selectedFloors.splice(entry, 1);
        }
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
    this.floors.forEach(f => {
      this.visibleLocation[f.identifier] = f.locations.filter(l =>
        l.name.toLowerCase().indexOf(filterString.toLocaleLowerCase()) > -1
      );
    });
  }

  /**
   * Sets the device filter string
   * @param filterString
   */
  filterDevices(filterString: string) {
    this.deviceFilter = filterString;
    this.showVisibleDevices();
  }

  sortLocationList(sort_point: string) {
    this.floorSortSelected = sort_point;
    switch (sort_point) {
      case 'Number of devices':
        this.floors.forEach(f => f.locations.sort((a, b) => b.devices.length - a.devices.length));
        break;
      case 'Number of errors':
        this.floors.forEach(f => f.locations.sort((a, b) => this.locationIssues[b.identifier] - this.locationIssues[a.identifier]));
        break;
      case 'Level':
        this.floors.forEach(f => f.locations.sort((a, b) => a.identifier > b.identifier ? -1 : 1));
        this.floors.sort((a, b) => a.level - b.level);
        break;
      case 'Type of room':
        break;
    }
  }

  newDeviceSelected(device: Device) {
    this.selectedDevice = device;
    this.selectedDeviceGroup = undefined;
    this.locationService.replaceState('/devices/' + device.identifier);
  }

  newDeviceGroupSelected(deviceGroup: DeviceGroup) {

    console.log('DEVICE GROUP SELECTED');

    let power_consumption = deviceGroup.devices.reduce((acc, prev) => acc + prev.power_consumption, 0);
    let power_upTime = deviceGroup.devices.reduce((acc, prev) => acc + prev.running, 0) / deviceGroup.devices.length;
    let power_downTime = deviceGroup.devices.reduce((acc, prev) => acc + prev.down_time, 0) / deviceGroup.devices.length;
    // Combine the lists
    let combined_desc = deviceGroup.devices.reduce((acc, prev) => acc.concat(prev.description), []);
    let combined_issues = deviceGroup.devices.reduce((acc, prev) => acc.concat(prev.issues), []);

    let combined_properties = [];
    for (let device of deviceGroup.devices) {
      // Create a copy from the properties array
      let currentProperties = JSON.parse(JSON.stringify(device.properties));
      for (let property of currentProperties) {
        property.name = device.name + ' - ' + property.name;
        combined_properties.push(property);
      }
    }
    // deviceGroup.devices.reduce((acc, prev) => acc.concat(prev.properties), []);


    let tempDevice = new Device(
      -1 + "",
      deviceGroup.name,
      null,
      power_consumption,
      power_upTime,
      power_downTime,
      combined_desc,
      combined_issues);

    tempDevice.properties = combined_properties;
    tempDevice.deviceGroup = true;

    this.selectedDeviceGroup = deviceGroup;
    this.selectedDevice = tempDevice;
    this.locationService.replaceState("/devices/g" + deviceGroup.identifier);
  }

  checkType(value) {
    if (value.hasOwnProperty("deviceGroup"))
      return "Device";
    return "DeviceGroup";
  }
}
