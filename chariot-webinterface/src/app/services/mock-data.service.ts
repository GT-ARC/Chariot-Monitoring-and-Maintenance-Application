import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

import {Location} from '../../model/location';
import {Device, Property} from '../../model/device';
import {Floor} from '../../model/floor';

import * as faker from 'faker';
import {Issue} from '../../model/issue';
import {IndividualProcess, ProcessProperty, ProductProcess} from '../../model/productProcess';
import {Container} from '../../model/Container';
import {Metadata} from '../../model/Metadata';
import {DeviceGroup} from '../../model/deviceGroup';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  floor: Floor[] = [];
  locations: Location[] = [];
  devices: Device[] = [];
  deviceGroup: DeviceGroup[] = [];

  mockDevices: Device[] = [];

  processes: ProductProcess[] = [];
  container: Container[] = [];

  metadata: Metadata = null;

  constructor() {
    console.log('Create new mock Data');
    this.createData();
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
      endTime -= MockDataService.getRandValue(0, timeInterval);
      endValue -= MockDataService.getRandValue(-valueRange, valueRange);
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

    let productsBehindPlan = MockDataService.createRandomData(dataAmount, dataEndTime, dataValue, timeInterval, valueInterval);

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
        MockDataService.makeid(10),
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
        MockDataService.makeid(10),
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
        MockDataService.makeid(10),
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
        MockDataService.makeid(10),
        'Security Measurement'
      ),
      new Property(
        new Date().valueOf(),
        'boolean',
        'log',
        Math.random() > 0.5,
        Math.random() > 0.5,
        MockDataService.makeid(10),
        'Log'
      ),
      new Property(
        new Date().valueOf(),
        'string',
        'name',
        faker.name.firstName() + ' ' + faker.name.lastName(),
        Math.random() > 0.5,
        MockDataService.makeid(10),
        'Name'
      ),
      new Property(
        new Date().valueOf(),
        'string',
        'destination',
        faker.address.streetAddress(true),
        Math.random() > 0.5,
        MockDataService.makeid(10),
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
          MockDataService.makeid(10),
          "starting_speed",
          ""
          ), new Property(
          new Date().valueOf(),
          "number",
          "ending_speed",
          35.0,
          Math.random() > 0.5,
          MockDataService.makeid(10),
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
          MockDataService.makeid(10),
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
          MockDataService.makeid(10),
          "step_time",
          "",
          0.5,
          5
        )
      ],
      Math.random() > 0.5,
      MockDataService.makeid(10),
      'Continuous Speed Request',
      '°'
      )
  ];
  }

  static issueIdentifier: number = 0;

  /**
   * Creates 5 Issues
   */
  static createIssues(): Issue[] {

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
        identifier: MockDataService.issueIdentifier++,
        // state: selectedDate == Math.floor(Date.now() / 86400000) * 86400000 ? Math.random() >= 0.2 : Math.random() >= 0,
        state: selectedDate == Math.floor(Date.now().valueOf() / 86400000) * 86400000 ? Math.random() >= 0.5 : Math.random() >= 0,
        description: '',
        type: faker.commerce.productName().slice(0, 15),
        issue_date: selectedDate + Math.floor(Math.random() * 86400000),
        importance: Math.floor(Math.random() * 100)
      });
    }

    return retIssues;
  }

  /**
   * Creates mock device properties
   */
  static createMockDeviceProperties():  Property[] {
    // Get mock device properties
    let mockDeviceProperties = MockDataService.createDeviceProperties();

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
        data = MockDataService.createRandomData(device_data_size, dataEndTime, dataValue, timeInterval, valueInterval);
        prop.createMockData(data, null);
        break;
      case 'boolean':
        dataValue= Math.random();
        data = MockDataService.createRandomData(device_data_size, dataEndTime, dataValue, timeInterval, valueInterval);
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

    let issues: Issue[] = MockDataService.createIssues();

    MockDataService.deviceIdentifier++;
    let predictionSize = Math.round(Math.random() * 5) + 5;
    let retDevice = new Device (
      MockDataService.deviceIdentifier + "",                         // Identifier
      'Device ' + MockDataService.deviceIdentifier,      // Name
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
      issues,
    );

    retDevice.properties = MockDataService.createMockDeviceProperties();

    return retDevice;
  }

  static deviceGroupIdentifier: number = 0;

  /**
   * Create Devices
   */
  createDevices(): void {
    // Create device groups
    for (let i = 0; i < 20; i++) {

      let dgi = MockDataService.deviceGroupIdentifier;

      let newDeviceGroup: DeviceGroup = new DeviceGroup(dgi, "Device Group: " + dgi);
      let randomDeviceAmountPerGroup = MockDataService.getRandValue(1, 3);

      for(let c = 0; c < randomDeviceAmountPerGroup; c++) {
        let newDevice = MockDataService.createDevice();
        newDevice.deviceGroupObj = newDeviceGroup;
        newDeviceGroup.addDevice(newDevice);
      }

      MockDataService.deviceGroupIdentifier++;
      this.deviceGroup.push(newDeviceGroup);
    }

    // Create some individual devices
    for(let i = 0; i < 20; i++) {
      this.mockDevices.push(MockDataService.createDevice());
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

          currLocation.addDeviceGroup(this.mockDevices.pop());

          devIndex += 1;
        } else {

          if(devIndex + 1 > this.deviceGroup.length)
            return;

          currLocation.addDeviceGroup(this.deviceGroup.pop());

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
      let floor: Floor = {
        identifier: 'f' + i,
        name: 'Floor ' + i,
        level: i,
        locations: this.locations.slice(devFloor, devFloor + randNumber)
      };
      this.floor.push(floor);
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
    let randomProperties = MockDataService.createProcessProperties();
    let productProcessArray = [
      {
        name: 'Scheduling',
        icon: 'schedule',
        progress: currentProgress == 0 ? Math.floor(Math.random() * 100) :
          currentProgress > 0 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: MockDataService.jsonCopy(randomProperties)
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
        properties: MockDataService.createPrintingProcessProperties()
      },
      {
        name: 'Measurement',
        icon: './assets/Icons/process_flow/measurement.svg',
        progress: currentProgress == 2 ? Math.floor(Math.random() * 100) :
          currentProgress > 2 ? 100 : -1,
        paused: false,
        total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
        running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
        properties: MockDataService.jsonCopy(randomProperties)
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
        properties: MockDataService.jsonCopy(randomProperties)
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
        properties: MockDataService.jsonCopy(randomProperties)
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
        properties: MockDataService.jsonCopy(randomProperties)
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
        properties: MockDataService.jsonCopy(randomProperties)
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
          MockDataService.createProductProcessArray(),
          MockDataService.createProductInfo(),
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

      let products = MockDataService.jsonCopy(this.processes)
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
    this.createDevices();
    this.createLocations();
    this.createFloors();

    // Do to the fact that not all devices and locations are used reduce the locations and device parameter to the actual used
    this.locations = this.floor.map(f => f.locations).reduce((prev, curr) => prev.concat(curr), []);

    this.deviceGroup = <DeviceGroup[]> this.floor.map(f =>
      f.locations.map(l => l.devices).reduce((prev, curr) => prev.concat(curr), [])
    ).reduce((prev, curr) => prev.concat(curr), []).filter( elem => elem instanceof DeviceGroup);

    // Ganz schöner quatsch hier. Guck dir das blos nicht an
    this.devices = this.floor.map(f =>
      f.locations.map(l => (<DeviceGroup[]> l.devices.filter(elem => elem instanceof DeviceGroup)).map(value => value.devices)
        .concat(f.locations.map(l => (<Device[]> l.devices.filter(elem => elem instanceof Device))))
          .reduce((prev, curr) => prev.concat(curr), [])
      ).reduce((prev, curr) => prev.concat(curr), [])
    ).reduce((prev, curr) => prev.concat(curr), []);

    this.createProcesses();
    this.createContainers();
  }

  printData() {
    console.log(
      JSON.stringify({
        devices: this.devices,
        locations: this.locations,
        floor: this.floor,
        processes: this.processes,
        container: this.container,
        metadata: this.metadata,
      }
    ));
  }

  static jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }

  addData() {

  }


  getFloor(): Observable<{ floors: Floor[], locations: Location[], devices: Device[], deviceGroup: DeviceGroup[]}> {
    return of({
      floors: this.floor,
      locations: this.locations,
      devices: this.devices,
      deviceGroup: this.deviceGroup
    });
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

  static makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  addFloor(newFloor: Floor) {
    if (this.floor.find(s => s.name == newFloor.name) == undefined){
      this.floor.push(newFloor);
      return true;
    }
    return false;
  }
}
