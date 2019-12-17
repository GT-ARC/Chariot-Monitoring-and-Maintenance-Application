import {EventEmitter, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {Location} from '../../model/location';
import {Device, Property} from '../../model/device';
import {Floor} from '../../model/floor';

import * as faker from 'faker';
import {Issue} from '../../model/issue';
import {IndividualProcess, ProcessProperty, ProductProcess} from '../../model/productProcess';
@Injectable({
  providedIn: 'root'
})
export class DataHandlingService {

  floors: Floor[] = [];
  locations: Location[] = [];
  devices: Device[] = [];
  deviceGroups: DeviceGroup[] = [];
  issues: Issue[] = [];

  mockDevices: Device[] = [];

  processes: ProductProcess[] = [];
  container: Container[] = [];

  metadata: Metadata = null;

  constructor(restService : RestService) {
    this.getLocalStoredDevices();
    console.log('Create new mock Data');
    this.createData();
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
            deviceGroupList.push(deviceGroup);
            this.deviceGroups.push(deviceGroup);
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
      this.issues.push(issue);
    }
    this.issues.sort((a, b) => {
      if (a.state != b.state)
        return a.state == false ? -1 : 1;
      return b.issue_date - a.issue_date
    });
    newDevice.lastIssue = device.lastIssue;
    newDevice.issueDetected = device.issueDetected;
    this.devices.push(newDevice);
    return newDevice;
  }

  dataNotificationList: EventEmitter<any>[] = [];
  getDataNotification() : EventEmitter<any> {
    let newDataNotifier = new EventEmitter<any>();
    this.dataNotificationList.push(newDataNotifier);
    return newDataNotifier;
  }

  dataUpdate() {
    console.log("Store changed data");
    localStorage.setItem("floor", JSON.stringify(this.floors));
    // for(let element of this.dataNotificationList) element.emit(null);
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

  getProcess(): Observable<{ process: ProductProcess[] }> {
    return of({
      process: this.processes,
    });
  }

  getContainer(): Observable<{ container: Container[] }> {
    return of({
      container: this.container,
    });
  }

  getMetaData(): Observable<{ metaData: Metadata }> {
    return of({
      metaData: this.metadata,
    });
  }

  getIssues(): Observable<{ issues: Issue[] }> {
    return of({
      issues: this.issues,
    });
  }

  addIssue(issue: Issue) {
    this.issues.push(issue);
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

    for (let loc of newFloor.locations) {

      // Search for the location and find it
      let foundLocation = this.locations.find(l => l.identifier == loc.identifier);
      if (foundLocation) {
        foundLocation.name = loc.name;
        foundLocation.type = loc.type;
        foundLocation.position = loc.position;
      } else {
        this.locations.push(loc);
      }
      for(let newDevice of loc.devices.filter(element => element instanceof Device)) {
        if (newDevice instanceof Device) {
          let foundDevice = this.devices.find(d => d.identifier == newDevice.identifier);
          if (foundDevice) {
            this.updateDevice(foundDevice, newDevice);
          } else {
            loc.devices.push(newDevice);
            this.devices.push(newDevice);
          }
        }
      }

      for(let newDeviceGroup of loc.devices.filter(element => element instanceof DeviceGroup)) {
        if (newDeviceGroup instanceof DeviceGroup) {
          let foundDeviceGroup = this.deviceGroups.find(d => d.identifier == newDeviceGroup.identifier);
          if (foundDeviceGroup) {
            for (let newDevice of newDeviceGroup.devices) {

              foundDeviceGroup.name = newDeviceGroup.name;

              // Update the device of the device group
              let oldDevice = foundDeviceGroup.devices.find(d => d.identifier == newDevice.identifier);
              if (oldDevice) {
                this.updateDevice(oldDevice, newDevice);
              } else {
                this.devices.push(newDevice);
                foundDeviceGroup.addDevice(newDevice);
              }
            }
          } else {
            for (let newDevice of newDeviceGroup.devices) {
              this.devices.push(newDevice);
            }
            this.deviceGroups.push(newDeviceGroup);
          }
        }
      }
    }
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
        }
      }
      for(let newDeviceGroup of loc.devices.filter(element => element instanceof DeviceGroup)) {
        if (newDeviceGroup instanceof DeviceGroup) {
          for (let newDevice of newDeviceGroup.devices) {
            this.devices.push(newDevice);
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
    oldDevice.deviceGroupObj = newDevice.deviceGroupObj;
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
    console.log("Update device: old: ", oldDevice.getIssueID(), " new ", newDevice.getIssueID());
  }

  /**
   * Create random value between min and max
   * @param min Lower bound
   * @param max Upper bound
   */
  private static getRandValue(min: number, max: number): number {
    return Math.floor((Math.random() * ((max - min) + 1)) + min);
  }

  /**
   * Create the (@code amount) of data beginning and the start time
   * @param amount The amount of the data to be created
   * @param endTime the time where the data should end
   * @param endValue The value on which the chart should end
   * @param timeInterval Time interval between the data entries
   * @param valueRange Value range of the data
   */
  static createRandomData(amount: number, endTime: number, endValue: number, timeInterval: number, valueRange: number): { x: number, y: number }[] {
    let retData: { x: number, y: number }[] = [];

    // create the data and put it into the
    for (let i = 0; i < amount; i++) {
      retData.push({x: endTime, y: endValue}); // Push the data into the ret array
      endTime -= DataHandlingService.getRandValue(0, timeInterval);
      endValue -= DataHandlingService.getRandValue(-valueRange, valueRange);
    }

    return retData;
  }

  /**
   * Create the meta data
   */
  createMetaData(): void {

    let dataEndTime: number = new Date().valueOf();   // Current time
    let dataValue: number = Math.random() * 100;      // Data value
    let timeInterval: number = Math.floor(Math.random() * 10 ** 9 + 10 ** 8 + 10 ** 7);
    let valueInterval: number = (Math.random() * 20 + 5);
    let dataAmount = Math.round(Math.random() * 30) + 10;   // The amount of data points

    let productsBehindPlan = DataHandlingService.createRandomData(dataAmount, dataEndTime, dataValue, timeInterval, valueInterval);

    let predictionSize = Math.round(Math.random() * 5) + 5;  // The amount of prediction time

    // Set the meta data value
    this.metadata = {
      prodBehindPlanData: productsBehindPlan.slice(0, productsBehindPlan.length - predictionSize),
      prodBehindPlanPrediction: productsBehindPlan.slice(productsBehindPlan.length - predictionSize - 1, productsBehindPlan.length)
    };
  }

  /**
   * Create the array of device properties with random values set
   */
  static createDeviceProperties(): Property [] {
    return [
      new Property(
        new Date().valueOf(),
        'number',
        'sensitivity',
        this.getRandValue(1, 100),
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Sensitivity',
        '%',
        0,
        100
      ),
      new Property(
        new Date().valueOf(),
        'number',
        'measurementSchedule',
        this.getRandValue(1, 100),
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Measurement schedule',
        'sec',
        0,
        100
      ),
      new Property(
        new Date().valueOf(),
        'number',
        'accuracy',
        this.getRandValue(1, 360),
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Accuracy',
        '°',
        0,
        360
      ),
      new Property(
        new Date().valueOf(),
        'boolean',
        'securityMeasurement',
        Math.random() > 0.5,
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Security Measurement'
      ),
      new Property(
        new Date().valueOf(),
        'boolean',
        'log',
        Math.random() > 0.5,
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Log'
      ),
      new Property(
        new Date().valueOf(),
        'string',
        'name',
        faker.name.firstName() + ' ' + faker.name.lastName(),
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Name'
      ),
      new Property(
        new Date().valueOf(),
        'string',
        'destination',
        faker.address.streetAddress(true),
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Destination'
      ),
      new Property(
        new Date().valueOf(),
        'array',
        'contSpeedReq',
        [
          new Property(
            new Date().valueOf(),
            "number",
            "starting_speed",
            5.0,
            Math.random() > 0.5,
            DataHandlingService.makeid(10),
            "starting_speed",
            ""
          ), new Property(
          new Date().valueOf(),
          "number",
          "ending_speed",
          35.0,
          Math.random() > 0.5,
          DataHandlingService.makeid(10),
          "ending_speed",
          "",
          1,
          100
        ), new Property(
          new Date().valueOf(),
          "number",
          "numberofsteps",
          30.0,
          Math.random() > 0.5,
          DataHandlingService.makeid(10),
          "numberofsteps",
          "",
          1,
          100
        ), new Property(
          new Date().valueOf(),
          "number",
          "step_time",
          2.0,
          Math.random() > 0.5,
          DataHandlingService.makeid(10),
          "step_time",
          "",
          0.5,
          5
        )
        ],
        Math.random() > 0.5,
        DataHandlingService.makeid(10),
        'Continuous Speed Request',
        '°'
      )
    ];
  }

  static issueIdentifier: number = 0;

  /**
   * Creates 5 Issues
   */
  static createIssues(device: Device): Issue[] {

    // Create issue dates for the issues to pick from
    let issueDates = [];
    for (let c = 0, date = Math.floor(Date.now().valueOf() / 86400000) * 86400000; c < 30; c++, date -= 86400000) {
      issueDates.push(date);
    }

    // Create the random issues
    let retIssues: Issue[] = [];
    for (let c = 0; c < Math.random() * 4; c++) {
      let selectedDate = issueDates[Math.floor(Math.random() * issueDates.length)];
      retIssues.push({
        identifier: [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join(''),
        // state: selectedDate == Math.floor(Date.now() / 86400000) * 86400000 ? Math.random() >= 0.2 : Math.random() >= 0,
        state: selectedDate == Math.floor(Date.now().valueOf() / 86400000) * 86400000 ? Math.random() >= 0.5 : Math.random() >= 0,
        description: '',
        type: faker.commerce.productName().slice(0, 15),
        issue_date: selectedDate + Math.floor(Math.random() * 86400000),
        importance: Math.floor(Math.random() * 100),
        name: device.name
      });
    }

    return retIssues;
  }

  /**
   * Creates mock device properties
   */
  static createMockDeviceProperties():  Property[] {
    // Get mock device properties
    let mockDeviceProperties = DataHandlingService.createDeviceProperties();

    // if(this['log1'] == undefined) {
    //   console.log(mockDeviceProperties);
    //   this['log1'] = true;
    // }

    let retDeviceProperties: Property[] = [];
    let devicePropertyAmount = this.getRandValue(1, 4);
    for (let i = 0; i < devicePropertyAmount; i++) {
      let element = this.getRandValue(0, mockDeviceProperties.length - 1);
      let deviceProperty = mockDeviceProperties.splice(element, 1).pop();
      retDeviceProperties.push(deviceProperty);
    }

    // Each device has the status property displaying the power state of the device if its turned on or off
    retDeviceProperties.push(
      new Property(
        new Date().valueOf(),
        "boolean",
        "status",
        Math.random() > 0.5,
        Math.random() > 0.5,
        "",
        "Power Consumption"
      )
    );

    // Create mock history data for each property
    for(let prop of retDeviceProperties) {
      this.insertPropWithData(prop);
    }

    // console.log(retDeviceProperties);

    return retDeviceProperties;
  }

  static insertPropWithData(prop: Property) {
    let device_data_size = Math.round(Math.random() * 500) + 10;
    let dataEndTime: number = Date.now().valueOf();
    let timeInterval = Math.floor(Math.random() * 86400000);
    let valueInterval = Math.random() * 20 + 5;
    let dataValue: number = 0;
    let data: { y: number, x: number }[];
    switch (prop.type) {
      case 'number':
        dataValue = Math.random() * 100;
        data = DataHandlingService.createRandomData(device_data_size, dataEndTime, dataValue, timeInterval, valueInterval);
        prop.createMockData(data, null);
        break;
      case 'boolean':
        dataValue= Math.random();
        data = DataHandlingService.createRandomData(device_data_size, dataEndTime, dataValue, timeInterval, valueInterval);
        data.forEach(ele => ele.y = Math.round(ele.y));
        prop.createMockData(data, null);
        break;
      case 'array':
        for(let nestedProp of <Property[]> prop.value) {
          this.insertPropWithData(nestedProp);
        }
        break;
    }
  }

  static deviceIdentifier: number = 0;

  /**
   * Creates a random device
   */
  static createDevice(): Device {

    DataHandlingService.deviceIdentifier++;
    let predictionSize = Math.round(Math.random() * 5) + 5;
    let retDevice = new Device (
      DataHandlingService.deviceIdentifier + "",                         // Identifier
      'Device ' + DataHandlingService.deviceIdentifier,      // Name
      null,                                             // Symbol
      Math.floor(Math.random() * 10000) / 100,
      Math.floor(Math.random() * 200 + 50),
      Math.floor(Math.random() * 50),
      [
        {
          title: "IP",
          desc: faker.internet.ip()
        },
        {
          title: "UUID",
          desc: faker.random.uuid()
        }
      ],
      null,
    );

    retDevice.issues = DataHandlingService.createIssues(retDevice);

    retDevice.properties = DataHandlingService.createMockDeviceProperties();

    return retDevice;
  }

  static deviceGroupIdentifier: number = 0;

  /**
   * Create Devices
   */
  createDevices(): void {
    // Create device groups
    for (let i = 0; i < 20; i++) {

      let dgi = DataHandlingService.deviceGroupIdentifier;

      let newDeviceGroup: DeviceGroup = new DeviceGroup(dgi + "", "Device Group: " + dgi);
      let randomDeviceAmountPerGroup = DataHandlingService.getRandValue(1, 3);

      for(let c = 0; c < randomDeviceAmountPerGroup; c++) {
        let newDevice = DataHandlingService.createDevice();
        newDevice.deviceGroupObj = newDeviceGroup;
        newDeviceGroup.addDevice(newDevice);
      }

      DataHandlingService.deviceGroupIdentifier++;
      this.deviceGroups.push(newDeviceGroup);
    }

    // Create some individual devices
    for(let i = 0; i < 20; i++) {
      this.mockDevices.push(DataHandlingService.createDevice());
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

      let randNumber = DataHandlingService.getRandValue(2, 3);
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


  //region Product Process creation

  /**
   * Creates a property array
   */
  static createProcessProperties(): ProcessProperty[] {
    return [
      {
        name: 'Name',
        unit: '',
        value: faker.name.findName(),
        size: 1,
        icon: 'perm_identity',
        errorThreshold: -1,
        display: true,
      },
      {
        name: 'File Name',
        unit: '',
        value: faker.system.fileName(),
        size: 1,
        icon: 'folder',
        errorThreshold: -1,
        display: true,
      },
      {
        name: 'Color',
        unit: '',
        value: faker.internet.color(),
        size: 1,
        icon: 'color_lens',
        errorThreshold: -1,
        display: true,
      },
      {
        name: 'Weight',
        unit: 'g',
        value: Math.floor(Math.random() * 10000) / 100,
        size: 1,
        icon: 'fitness_center',
        errorThreshold: Math.floor(Math.random() * 5000) / 100,
        display: true,
      },
      {
        name: 'Temperature',
        unit: '°C',
        value: Math.floor(Math.random() * 10000) / 100,
        size: 2,
        icon: 'waves',
        errorThreshold: Math.floor(Math.random() * 5000) / 100,
        display: true,
      },
      {
        name: 'Speed',
        unit: 'm/s',
        value: Math.floor(Math.random() * 10000) / 100,
        size: 1,
        icon: 'navigate_next',
        errorThreshold: Math.floor(Math.random() * 5000) / 100,
        display: true,
      },
    ];
  }

  /**
   * Creates the printing process properties
   */
  static createPrintingProcessProperties(): ProcessProperty[] {
    return [
      {
        name: 'Travel Speed',
        unit: 'mm/s',
        value: Math.floor(Math.random() * 200),
        size: 1,
        icon: 'flash_on',
        errorThreshold: -1,
        display: true,
      },
      {
        name: 'Infill Density',
        unit: 'mm/s',
        value: Math.floor(Math.random() * 200),
        size: 1,
        icon: 'flash_on',
        errorThreshold: -1,
        display: true,
      },
      {
        name: 'Filament usage',
        unit: 'mm/s',
        value: Math.floor(Math.random() * 200),
        size: 1,
        icon: 'flash_on',
        errorThreshold: -1,
        display: true,
      },
      {
        name: 'Extruder Temperature',
        unit: 'mm/s',
        value: Math.floor(Math.random() * 200),
        size: 1,
        icon: 'flash_on',
        errorThreshold: -1,
        display: true,
      },
      {
        name: 'Filament level',
        value: Math.floor(Math.random() * 100),
        display: false,
      },
      {
        name: 'Filament Diameter',
        unit: 'mm/s',
        value: Math.floor(Math.random() * 200),
        size: 1,
        icon: 'flash_on',
        errorThreshold: -1,
        display: true,
      },
    ];
  }

  /**
   * Create the individual processes of the product
   */
  static createProductProcessArray(): IndividualProcess[] {
    let currentProgress = Math.floor(Math.random() * 7);      // On which process the product currently is
    let randomProperties = DataHandlingService.createProcessProperties();
    let productProcessArray = [
      {
        name: 'Scheduling',
        icon: 'schedule',
        progress: currentProgress == 0 ? Math.floor(Math.random() * 100) :
          currentProgress > 0 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: DataHandlingService.jsonCopy(randomProperties)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * randomProperties.length + 3))
      },
      {
        name: 'Printing Product Process',
        icon: './assets/Icons/process_flow/printer.svg',
        progress: currentProgress == 1 ? Math.floor(Math.random() * 100) :
          currentProgress > 1 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: DataHandlingService.createPrintingProcessProperties()
      },
      {
        name: 'Measurement',
        icon: './assets/Icons/process_flow/measurement.svg',
        progress: currentProgress == 2 ? Math.floor(Math.random() * 100) :
          currentProgress > 2 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: DataHandlingService.jsonCopy(randomProperties)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * randomProperties.length + 3))
      },
      {
        name: 'Deformation Checking',
        icon: './assets/Icons/process_flow/deformation_checking.svg',
        progress: currentProgress == 3 ? Math.floor(Math.random() * 100) :
          currentProgress > 3 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: DataHandlingService.jsonCopy(randomProperties)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * randomProperties.length + 3))
      },
      {
        name: 'Packing',
        icon: './assets/Icons/process_flow/packing.svg',
        progress: currentProgress == 4 ? Math.floor(Math.random() * 100) :
          currentProgress > 4 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: DataHandlingService.jsonCopy(randomProperties)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * randomProperties.length + 3))
      },
      {
        name: 'Robot Carrier',
        icon: './assets/Icons/process_flow/robot.svg',
        progress: currentProgress == 5 ? Math.floor(Math.random() * 100) :
          currentProgress > 5 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: DataHandlingService.jsonCopy(randomProperties)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * randomProperties.length + 3))
      },
      {
        name: 'Store in Warehouse',
        icon: './assets/Icons/process_flow/warehouse.svg',
        progress: currentProgress == 6 ? Math.floor(Math.random() * 100) :
          currentProgress > 6 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: DataHandlingService.jsonCopy(randomProperties)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * randomProperties.length + 3))
      },
    ];

    // To make the process each device has to go through more individual remove some process from the process array
    for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
      let remove = Math.floor(Math.random() * productProcessArray.length);
      // If its the currently active process skip it
      if (productProcessArray[remove].progress > 0 && productProcessArray[remove].progress < 100) {
        continue;
      }
      productProcessArray.splice(remove, 1);
    }

    return productProcessArray;
  }

  /**
   * Create random product info
   */
  static createProductInfo(): { name: string; value: string }[] {
    let productInfo =  [
      {
        name: 'Material',
        value: faker.commerce.productMaterial()
      },
      {
        name: 'Color',
        value: faker.commerce.color(),
      },
      {
        name: 'Price',
        value: faker.commerce.price(),
      },
      {
        name: 'Catch Phrase',
        value: faker.company.catchPhrase()
      },
      {
        name: 'Date',
        value: faker.date.future().toDateString()
      },
      {
        name: 'Reg Number',
        value: faker.finance.iban()
      },
      {
        name: 'Bitcoin Address',
        value: faker.finance.bitcoinAddress()
      },
      {
        name: 'Country',
        value: faker.address.country()
      }
    ];

    // For individuality remove some information
    for (let i = 0; i < Math.floor(Math.random() * 4 + 2); i++) {
      productInfo.splice(Math.floor(Math.random() * productInfo.length), 1);
    }

    return productInfo;
  }

  /**
   * Create the processes
   */
  createProcesses() {
    let processIdentifier: number = 0;
    for (let i = 0; i < 100; i++) {

      let categorys = ['Category I', 'Category II', 'Category III', 'Category IV'];
      let productStatus = ['Status A', 'Status B', 'Status C'];

      // Add the process to the process array
      this.processes.push(
        new ProductProcess(
          processIdentifier++,
          'Additonal information',
          faker.commerce.productName(),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 200),
          new Date().valueOf() - Math.floor(Math.random() * 24 * 60 * 60 * 1000 * 20),
          'Status information',
          productStatus[Math.floor(Math.random() * productStatus.length)],
          Math.random() > 0.5,
          Math.random() > 0.5 ? './assets/Images/product1.png' : './assets/Images/product2.png',
          DataHandlingService.createProductProcessArray(),
          DataHandlingService.createProductInfo(),
          categorys[Math.floor(Math.random() * categorys.length)]
        )
      );
    }
  }

  /**
   * Create container which holds th
   */
  createContainers() {
    // Create containers
    for (let i = 0; i < 5; i++) {

      let containerName = faker.commerce.productName();
      if (containerName.length > 15) {
        containerName = containerName.slice(0, 15);
      }

      let maxProduct = Math.floor(Math.random() * this.processes.length + 10);

      let products = DataHandlingService.jsonCopy(this.processes)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * (maxProduct - 10) + 10));

      this.container.push({
        identifier: i,
        maxProductStorage: Math.floor(Math.random() * 100 + products.length),
        maxWeight: Math.floor(Math.random() * 200 + products.reduce((prev, curr) => prev + curr.weight, 0)),
        name: containerName,
        containerInfo: [
          {name: 'Lorum Ipsum', value: 'Dico prmpta dissentiet'},
          {name: 'Lorum Ipsum', value: 'Oratio volumus'},
        ],
        products: products,
      });
    }
  }
  //endregion

  /**
   * Creates the mock data
   */
  createData(): void {

    this.createMetaData();
    // this.createDevices();
    // this.createLocations();
    // this.createFloors();

    // Do to the fact that not all devices and locations are used reduce the locations and device parameter to the actual used
    // this.locations = this.floor.map(f => f.locations).reduce((prev, curr) => prev.concat(curr), []);
    //
    // this.deviceGroup = this.floor.map(f =>
    //   f.locations.map(l => l.deviceGroups).reduce((prev, curr) => prev.concat(curr), [])
    // ).reduce((prev, curr) => prev.concat(curr), []).filter( elem => elem instanceof DeviceGroup);
    //
    // this.devices = this.floor.map(f =>
    //   f.locations.map(l => (<DeviceGroup[]> l.devices.filter(elem => elem instanceof DeviceGroup)).map(value => value.devices)
    //     .concat(f.locations.map(l => (<Device[]> l.devices.filter(elem => elem instanceof Device))))
    //     .reduce((prev, curr) => prev.concat(curr), [])
    //   ).reduce((prev, curr) => prev.concat(curr), [])
    // ).reduce((prev, curr) => prev.concat(curr), []);

    this.createProcesses();
    this.createContainers();
  }

  printData() {
    console.log(
      JSON.stringify({
          devices: this.devices,
          locations: this.locations,
          floor: this.floors,
          processes: this.processes,
          container: this.container,
          metadata: this.metadata,
        }
      ));
  }

  static jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }

  static makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
import {Container} from '../../model/Container';
import {Metadata} from '../../model/Metadata';

import {DeviceGroup} from '../../model/deviceGroup';
import {RestService} from "./rest.service";
