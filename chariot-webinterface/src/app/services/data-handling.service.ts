import {EventEmitter, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Location} from '../../model/location';
import {Device} from '../../model/device';
import {Floor} from '../../model/floor';
import {Issue} from '../../model/issue';
import {IndividualProcess, ProcessProperty, Product} from '../../model/Product';
import {Container} from '../../model/Container';
import {Metadata} from '../../model/Metadata';
import {DeviceGroup} from '../../model/deviceGroup';
import {RestService} from "./rest.service";
import {environment} from '../../environments/environment';
import {MockDataService} from "./mock-data.service";
import {Settings, SettingsEntry} from "../../model/settings";
import { settings } from 'src/environments/default_settings';
import {element} from "protractor";

@Injectable({
  providedIn: 'root'
})
export class DataHandlingService {

  floors: Floor[] = [];
  locations: Location[] = [];
  devices: Device[] = [];
  deviceGroups: DeviceGroup[] = [];
  issues: Issue[] = [];

  issueMap: Map<String, Issue> = new Map();
  deviceMap: Map<string, Device> = new Map();

  products: Product[] = [];
  container: Container[] = [];

  metadata: Metadata = null;

  settings: Settings = settings;
  changedSettings : {name:string, value: boolean, location: string}[] = [];

  constructor(restService : RestService) {
    let version = localStorage.getItem("version");
    if (version) {
      if (environment.version != version) {
        DataHandlingService.clearStorage();
      }
    } else {
      DataHandlingService.clearStorage();
      localStorage.setItem("version", environment.version);
    }

    try {
      this.getLocalStoredDevices();
      this.getLocalStoredContainer();
      this.getLocalStoredMetadata();
      this.getLocalStoredSettings();
    } catch (e) {
      console.log('Create new mock Data', e);
      this.createData();
      this.storeCreatedData();
    }
  }

  private static clearStorage() {
    console.log("Clear local storage");
    localStorage.removeItem("floor");
    localStorage.removeItem("container");
    localStorage.removeItem("metadata");
  }

  getDeviceByURL(url: string) {
    let deviceID = url.substr(url.indexOf("devices/") + 8, 36);
    if(!this.deviceMap.has(deviceID))
      return null;
    return this.deviceMap.get(deviceID);
  }

  storeSettings(settingsEntry: SettingsEntry, location: string) {
    if(this.changedSettings.find(element => element.name == settingsEntry.name) == undefined) {
      this.changedSettings.push({
        name: settingsEntry.name,
        value: settingsEntry.value,
        location: location
      });
      localStorage.setItem("settings", JSON.stringify(this.changedSettings));
    }
  }

  private getLocalStoredSettings() {
    let settings = JSON.parse(localStorage.getItem("settings")) as {name:string, value: any, location: string}[];
    if(settings) {
      for (let changedSetting of settings) {

        let foundSettings = this.settings[changedSetting.location].find(entry => entry.name == changedSetting.name);

        if (foundSettings)
          foundSettings.value = changedSetting.value;
        console.log(foundSettings)
      }
    }
  }

  getLocalStoredContainer() {
    let container = JSON.parse(localStorage.getItem("container"));
    if(container) {
      for(let currCon of container) {
        (<Container>currCon).products = this.getLocalStoredProcesses(currCon.products);
        this.container.push(currCon)
      }
    } else {
      throw Error('Containers aren\'t stored in local storage');
    }
  }

  getLocalStoredProcesses(processes) {
    let retProcesses = [];
    if(processes) {
      for ( let process of processes) {

        let individualProcess : IndividualProcess[] = [];
        for (let currInProcess of process.productionFlow) {
          individualProcess.push({
            name: currInProcess.name,
            icon: currInProcess.icon,
            progress: currInProcess.progress,
            paused: currInProcess.paused,
            total: new Date(currInProcess.total),
            running: new Date(currInProcess.running),
            properties: currInProcess.properties
          })
        }

        let currentProcess = new Product(
          process.identifier,
          process.productAddInfo,
          process.productName,
          process.weight,
          process.energyUsed,
          process.deliveryDate,
          process.statusInformation,
          process.status,
          process.state,
          process.image,
          process.individualProcess,
          process.productInfo,
          process.category);
          retProcesses.push(currentProcess);
          this.products.push(currentProcess);
      }
    } else {
      throw Error('process aren\'t stored in local storage');
    }
    return retProcesses;
  }

  getLocalStoredMetadata() {
    let metadata = JSON.parse(localStorage.getItem("metadata"));
    if(metadata) {
      this.metadata = metadata;
    } else {
      throw Error('Metadata aren\'t stored in local storage');
    }
  }

  getLocalStoredDevices() {
    let storedFloors = localStorage.getItem("floor");
    try {
      let floors = JSON.parse(storedFloors);
      if(!floors) return;

      console.log("Found stored data");

      for(let floor of floors) {
        let locList = [];
        for(let loc of floor.locations) {
          let deviceList = [];
          for(let device of loc.devices) {
            deviceList.push(this.addDevice(device));
          }
          let deviceGroupList = [];
          for(let deviceGroup of loc.deviceGroups) {
            let newDeviceGroup = this.addDeviceGroup(deviceGroup);
            deviceGroupList.push(newDeviceGroup);
            this.deviceGroups.push(newDeviceGroup);
          }
          loc.devices = deviceList;
          loc.deviceGroups = deviceGroupList;
          locList.push(loc);
          this.locations.push(loc);
        }
        floor.locations = locList;
        this.floors.push(floor);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private addDevice(device: Device) : Device {
    let newDevice = new Device(device.identifier,
      device.name,
      device.symbol,
      device.power_consumption,
      device.running,
      device.down_time,
      device.description,
      device.issues
    );
    newDevice.properties = device.properties;
    newDevice.issues = device.issues;
    for(let issue of device.issues){
      this.addIssue(issue)
    }
    newDevice.lastIssue = device.lastIssue;
    newDevice.issueDetected = device.issueDetected;
    this.devices.push(newDevice);
    this.deviceMap.set(device.identifier, newDevice);
    return newDevice;
  }

  dataNotificationList: EventEmitter<any>[] = [];
  getDataNotification() : EventEmitter<any> {
    let newDataNotifier = new EventEmitter<any>();
    this.dataNotificationList.push(newDataNotifier);
    return newDataNotifier;
  }

  addProducts(products: Product[]) {
    this.cleanProducts();
    for (let product of products)
      this.products.push(Product.createProduct(product));
    console.log(this.products);
  }

  private cleanProducts() {
    while (this.products.length > 0) {
      this.products.pop();
    }
  }

  dataUpdate() {
    // console.log("Store changed data");
    // this.storeIssues();
  }

  getFloor(): Observable<{ floors: Floor[], locations: Location[], devices: Device[], deviceGroup: DeviceGroup[]}> {
    let newObserver = of({
      floors: this.floors,
      locations: this.locations,
      devices: this.devices,
      deviceGroup: this.deviceGroups
    });
    return newObserver;
  }

  getProducts(): Observable<{ products: Product[] }> {
    return of({
      products: this.products,
    });
  }

  getContainer(): Observable<{ container: Container[] }> {
    return of({
      container: this.container,
    });
  }

  getMetadata(): Observable<{ metaData: Metadata }> {
    return of({
      metaData: this.metadata,
    });
  }

  getIssues(): Observable<{ issues: Issue[] }> {
    return of({
      issues:  this.issues,
    });
  }

  getSettings(): Observable<{ settings: Settings }> {
    return of({
      settings:  this.settings,
    });
  }

  private storeCreatedData() {
    localStorage.setItem("version", environment.version);
    localStorage.setItem("floor", JSON.stringify(this.floors));
    localStorage.setItem("container", JSON.stringify(this.container));
    localStorage.setItem("metadata", JSON.stringify(this.metadata));
  }

  private addDeviceGroup(deviceGroup: any) {
    let newDeviceGroup = new DeviceGroup(deviceGroup.identifier,
      deviceGroup.name
    );
    for(let device of deviceGroup.devices) {
      newDeviceGroup.addDevice(this.addDevice(device))
    }

    return newDeviceGroup;
  }

  addIssue(issue: Issue) {
    if(!this.issueMap.has(issue.identifier)){
      this.issues.push(issue);
      this.issueMap.set(issue.identifier, issue);
      return true;
    }
    return false;
  }

  /**
   * if the floor is already present try to update the local device with the new data
   *
   * @param newFloor
   */
  handleNewFloor(newFloor: Floor) {

    console.log("Handle new floor: ", newFloor);

    // remove old floor
    let foundFloor = this.floors.find(s => s.identifier == newFloor.identifier);
    if(foundFloor) {
      foundFloor.level = newFloor.level;
      foundFloor.name = newFloor.name;
    } else {
      // Assume everything from the new floor is new if the floor is new
      this.addNewFloor(newFloor);
      localStorage.setItem("floor", JSON.stringify(this.floors));
      return this.devices;
    }

    let newDevicesIDs : string[] = [];
    let newLocationIDs : string[] = [];

    for (let loc of newFloor.locations) {

      // Search for the location and find it
      newLocationIDs.push(loc.identifier);

      let foundLocation = this.locations.find(l => l.identifier == loc.identifier);

      if (foundLocation) {
        foundLocation.name = loc.name;
        foundLocation.type = loc.type;
        foundLocation.position = loc.position;
      } else {
        console.log("Found new location");
        this.locations.push(loc);
        foundFloor.locations.push(loc);
      }

      for(let newDevice of loc.devices.filter(element => element instanceof Device)) {
        if (newDevice instanceof Device) {

          newDevicesIDs.push(newDevice.identifier);
          let foundDevice = this.devices.find(d => d.identifier == newDevice.identifier);

          if (foundDevice) {
            this.updateDevice(foundDevice, newDevice);
          } else {
            if(loc.devices.map(d => d.identifier).indexOf(newDevice.identifier) == -1)
              loc.devices.push(newDevice);
            this.devices.push(newDevice);
            this.deviceMap.set(newDevice.identifier, newDevice)
          }
        }
      }

      // for(let newDeviceGroup of loc.devices.filter(element => element instanceof DeviceGroup)) {
      //   if (newDeviceGroup instanceof DeviceGroup) {
      //     let foundDeviceGroup = this.deviceGroups.find(d => d.identifier == newDeviceGroup.identifier);
      //     if (foundDeviceGroup) {
      //       for (let newDevice of newDeviceGroup.devices) {
      //
      //         foundDeviceGroup.name = newDeviceGroup.name;
      //
      //         // Update the device of the device group
      //         let oldDevice = foundDeviceGroup.devices.find(d => d.identifier == newDevice.identifier);
      //         if (oldDevice) {
      //           this.updateDevice(oldDevice, newDevice);
      //         } else {
      //           this.devices.push(newDevice);
      //           this.deviceMap.set(newDevice.identifier, newDevice);
      //           foundDeviceGroup.addDevice(newDevice);
      //         }
      //       }
      //     } else {
      //       for (let newDevice of newDeviceGroup.devices) {
      //         this.devices.push(newDevice);
      //         this.deviceMap.set(newDevice.identifier, newDevice);
      //       }
      //       this.deviceGroups.push(newDeviceGroup);
      //     }
      //   }
      // }
    }


    // Remove locally stored devices not found in db
    this.devices.forEach(d => {
      let deviceIndex = newDevicesIDs.indexOf(d.identifier);
      if (deviceIndex == -1) {
        console.log("Remove not found device: " + d);
        this.devices.splice(deviceIndex, 1);
        this.floors.forEach(f => f.locations.forEach( l => {
          let deviceIndex = l.devices.map(d => d.identifier).indexOf(d.identifier);
          if (deviceIndex != -1) {
            l.devices.splice(deviceIndex, 1);
          }
          if (l.devices.length == 0) {
            f.locations.splice(f.locations.indexOf(l), 1);
          }
        }));
      }
    });

    localStorage.setItem("floor", JSON.stringify(this.floors));
    return this.devices;
  }

  addNewFloor(newFloor: Floor) {
    this.floors.push(newFloor);
    for (let loc of newFloor.locations) {
      this.locations.push(loc);
      for(let newDevice of loc.devices.filter(element => element instanceof Device)) {
        if (newDevice instanceof Device) {
          this.devices.push(newDevice);
          this.deviceMap.set(newDevice.identifier, newDevice)
        }
      }
      for(let newDeviceGroup of loc.devices.filter(element => element instanceof DeviceGroup)) {
        if (newDeviceGroup instanceof DeviceGroup) {
          for (let newDevice of newDeviceGroup.devices) {
            this.devices.push(newDevice);
            this.deviceMap.set(newDevice.identifier, newDevice)
          }
          this.deviceGroups.push(newDeviceGroup);
        }
      }
    }
    for(let element of this.dataNotificationList) element.emit(newFloor);
  }

  /**
   * Updates the values and properties of the old device to the new device
   *
   * @param oldDevice The old device which should be updated
   * @param newDevice The new device which holds the new values
   */
  updateDevice(oldDevice: Device, newDevice: Device) {
    oldDevice.deviceGroup = newDevice.deviceGroup;
    oldDevice.name = newDevice.name;
    oldDevice.symbol = newDevice.symbol;
    oldDevice.power_consumption = newDevice.power_consumption;
    oldDevice.running = newDevice.running;
    oldDevice.down_time = newDevice.down_time;
    oldDevice.description = newDevice.description;

    for (let prop of newDevice.properties) {
      let oldProp = oldDevice.properties.find(p => p.url == prop.url);
      if (oldProp){
        oldProp.timestamp = prop.timestamp;
        oldProp.topic = prop.topic;
        oldProp.type = prop.type;
        oldProp.name = prop.name;
        oldProp.key = prop.key;
        oldProp.value = prop.value;
        oldProp.min_value = prop.min_value;
        oldProp.max_value = prop.max_value;
        oldProp.unit = prop.unit;
        oldProp.writable = prop.writable;
      } else {
        oldDevice.properties.push(prop);
      }
    }
    console.log("Update device: old: ", oldDevice, " new ", newDevice);
  }

  mockDevices: Device[] = [];

  /**
   * Create Devices
   */
  createDevices() {
    // Create device groups
    for (let i = 0; i < 20; i++) {

      let dgi = MockDataService.deviceGroupIdentifier;

      let newDeviceGroup: DeviceGroup = new DeviceGroup(dgi + "", "Device Group: " + dgi);
      let randomDeviceAmountPerGroup = MockDataService.getRandValue(1, 3);

      for(let c = 0; c < randomDeviceAmountPerGroup; c++) {
        let newDevice = MockDataService.createDevice();
        newDeviceGroup.addDevice(newDevice);
      }

      MockDataService.deviceGroupIdentifier++;
      this.deviceGroups.push(newDeviceGroup);
    }

    // Create some individual devices
    for(let i = 0; i < 20; i++) {
      let device = MockDataService.createDevice();
      this.mockDevices.push(device);
      this.devices.push(device)
    }
  }

  /**
   * Create the locations of the devices
   */
  createLocations(): void {
    let devGroupIndex = 0;
    let devIndex = 0;
    for (let i = 0; i < 20; i++) {

      let currLocation = new Location (
        i + "",
        null,
        Math.random() > 0.5 ? 'Room ' + i : 'Space ' + i,
        null
      );

      let randNumber = MockDataService.getRandValue(2, 3);
      for(let c = 0; c < randNumber; c++) {
        // Put individual devices and device groups into the location devices
        if(Math.random() > 0.5) {

          if(devIndex + 1 > this.mockDevices.length)
            return;

          currLocation.addDevice(this.mockDevices.pop());

          devIndex += 1;
        } else {

          if(devIndex + 1 > this.deviceGroups.length)
            return;

          currLocation.addDeviceGroup(this.deviceGroups.pop());

          devGroupIndex += 1;
        }
      }
      this.locations.push(currLocation);
    }
  }

  /**
   * Create the floors which holds the locations
   */
  createFloors() {
    var devFloor = 0;
    for (let i = 0; i < 2; i++) {
      let randNumber = Math.floor(Math.random() * 8) + 2;
      let floor : Floor = new Floor(
        'f' + i,
        'Floor ' + i,
        i,
        this.locations.slice(devFloor, devFloor + randNumber),
      );
      this.floors.push(floor);
      devFloor = devFloor + randNumber;
    }
  }

  /**
   * Create the processes
   */
  createProcesses() {
    for (let i = 0; i < 100; i++) {
      // Add the process to the process array
      this.products.push(
        MockDataService.createProductProcess()
      );
    }
  }

  /**
   * Create container which holds th
   */
  createContainers() {
    // Create containers
    for (let i = 0; i < 5; i++) {
      this.container.push(MockDataService.createContainer(this.products));
    }
  }

  //endregion

  /**
   * Creates the mock data
   */
  createData(): void {

    DataHandlingService.clearStorage();

    this.metadata = MockDataService.createMetaData();
    if (environment.mock){
      this.createDevices();
      this.createLocations();
      this.createFloors();
      // Do to the fact that not all devices and locations are used reduce the locations and device parameter to the actual used
      this.locations = this.floors.map(f => f.locations).reduce((prev, curr) => prev.concat(curr), []);

      this.deviceGroups = this.floors.map(f =>
        f.locations.map(l => l.deviceGroups).reduce((prev, curr) => prev.concat(curr), [])
      ).reduce((prev, curr) => prev.concat(curr), []).filter( elem => elem instanceof DeviceGroup);

      this.devices = this.floors.map(f =>
        f.locations.map(l => (<DeviceGroup[]><unknown>l.devices.filter(elem => elem instanceof DeviceGroup)).map(value => value.devices)
          .concat(f.locations.map(l => {
            (<Device[]>l.devices.filter(elem => elem instanceof Device))
              .map(d => d.issues)
              .reduce((prev, curr) => prev.concat(curr), [])
              .forEach(issue => this.addIssue(issue));
            (<Device[]>l.devices.filter(elem => elem instanceof Device))
              .forEach(d => this.deviceMap.set(d.identifier, d));
            return (<Device[]>l.devices.filter(elem => elem instanceof Device));
          }))
          .reduce((prev, curr) => prev.concat(curr), [])
        ).reduce((prev, curr) => prev.concat(curr), [])
      ).reduce((prev, curr) => prev.concat(curr), []);
    }


    this.createProcesses();
    this.createContainers();
  }

  printData() {
    console.log(
      JSON.stringify({
          devices: this.devices,
          locations: this.locations,
          floor: this.floors,
          processes: this.products,
          container: this.container,
          metadata: this.metadata,
        }
      ));
  }

  getRandomDevice(): Device {
    return this.devices[Math.floor(this.devices.length * Math.random())]
  }

}

