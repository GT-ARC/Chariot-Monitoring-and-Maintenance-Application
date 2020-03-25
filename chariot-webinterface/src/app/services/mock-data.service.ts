import { Injectable } from '@angular/core';
import {Device, Property} from "../../model/device";
import * as faker from 'faker';
import {Issue} from "../../model/issue";
import {DeviceGroup} from "../../model/deviceGroup";
import {Location} from "../../model/location";
import {Floor} from "../../model/floor";
import {IndividualProcess, ProcessProperty, ProductProcess} from "../../model/productProcess";

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }

  /**
   * Create random value between min and max
   * @param min Lower bound
   * @param max Upper bound
   */
  static getRandValue(min: number, max: number): number {
    return Math.floor((Math.random() * ((max - min) + 1)) + min);
  }

  /**
   * Create a copy of the given object
   * @param
   */
  static jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }

  /**
   * Create a new id with the respective length
   */
  static makeid() {
    return faker.random.uuid();
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

    return retData.reverse();
  }

  /**
   * Create the meta data
   */
  public static createMetaData(): { prodBehindPlanPrediction: { x: number; y: number }[]; prodBehindPlanData: { x: number; y: number }[] } {

    let dataEndTime: number = new Date().valueOf();   // Current time
    let dataValue: number = Math.random() * 100;      // Data value
    let timeInterval: number = Math.floor(Math.random() * 10 ** 9 + 10 ** 8 + 10 ** 7);
    let valueInterval: number = (Math.random() * 20 + 5);
    let dataAmount = Math.round(Math.random() * 30) + 10;   // The amount of data points

    let productsBehindPlan = MockDataService.createRandomData(dataAmount, dataEndTime, dataValue, timeInterval, valueInterval);

    let predictionSize = Math.round(Math.random() * 5) + 5;  // The amount of prediction time

    // Set the meta data value
    return {
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
        MockDataService.makeid(),
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
        MockDataService.makeid(),
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
        MockDataService.makeid(),
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
        MockDataService.makeid(),
        'Security Measurement'
      ),
      new Property(
        new Date().valueOf(),
        'boolean',
        'log',
        Math.random() > 0.5,
        Math.random() > 0.5,
        MockDataService.makeid(),
        'Log'
      ),
      new Property(
        new Date().valueOf(),
        'string',
        'name',
        faker.name.firstName() + ' ' + faker.name.lastName(),
        Math.random() > 0.5,
        MockDataService.makeid(),
        'Name'
      ),
      new Property(
        new Date().valueOf(),
        'string',
        'destination',
        faker.address.streetAddress(true),
        Math.random() > 0.5,
        MockDataService.makeid(),
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
            MockDataService.makeid(),
            "starting_speed",
            ""
          ), new Property(
          new Date().valueOf(),
          "number",
          "ending_speed",
          35.0,
          Math.random() > 0.5,
          MockDataService.makeid(),
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
          MockDataService.makeid(),
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
          MockDataService.makeid(),
          "step_time",
          "",
          0.5,
          5
        )
        ],
        Math.random() > 0.5,
        MockDataService.makeid(),
        'Continuous Speed Request',
        '°'
      )
    ];
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
        identifier: MockDataService.makeid(),
        // state: selectedDate == Math.floor(Date.now() / 86400000) * 86400000 ? Math.random() >= 0.2 : Math.random() >= 0,
        state: true,
        description: '',
        type: faker.commerce.productName().slice(0, 15),
        issue_date: selectedDate + Math.floor(Math.random() * 86400000),
        importance: Math.floor(Math.random() * 100),
        name: device.name,
        relatedDeviceId: device.identifier,
        relatedTo: [],
        url: ""
      });
    }
    retIssues = retIssues.sort(((a, b) => a.issue_date - b.issue_date));
    if(retIssues.length != 0) retIssues[retIssues.length - 1].state = Math.random() > 0.2;
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

  static deviceIdentifier: number = 0;
  static deviceGroupIdentifier: number = 0;

  /**
   * Creates a random device
   */
  static createDevice(): Device {

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
      null,
    );

    retDevice.properties = MockDataService.createMockDeviceProperties();

    retDevice.issues = MockDataService.createIssues(retDevice);
    retDevice.issues.forEach(i => {
      let numberProperties = retDevice.properties.filter(p => p.type == "number");
      let propAmount = MockDataService.getRandValue(1, 3);
      return i.relatedTo =
          numberProperties.slice(0, propAmount <= numberProperties.length ? propAmount : numberProperties.length);
      }
    );
    retDevice.issueDetected = retDevice.hasIssue() > 0;

    return retDevice;
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


  static processIdentifier: number = 0;
  static categorys = ['Category I', 'Category II', 'Category III', 'Category IV'];
  static productStatus = ['Status A', 'Status B', 'Status C'];

  static createProductProcess() {
    return new ProductProcess(
      MockDataService.processIdentifier++,
      'Additonal information',
      faker.commerce.productName(),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 200),
      new Date().valueOf() - Math.floor(Math.random() * 24 * 60 * 60 * 1000 * 20),
      'Status information',
      (MockDataService.productStatus)[Math.floor(Math.random() * MockDataService.productStatus.length)],
      Math.random() > 0.5,
      Math.random() > 0.5 ? './assets/Images/product1.png' : './assets/Images/product2.png',
      MockDataService.createProductProcessArray(),
      MockDataService.createProductInfo(),
      (MockDataService.categorys)[Math.floor(Math.random() * MockDataService.categorys.length)]
    );
  }

  static containerIdentifier: number = 0;
  static createContainer(processes) {
    let containerName = faker.commerce.productName();
    if (containerName.length > 15) {
      containerName = containerName.slice(0, 15);
    }
    let maxProduct = Math.floor(Math.random() * processes.length + 10);
    let products = MockDataService.jsonCopy(processes)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * (maxProduct - 10) + 10));
    return {
      identifier: MockDataService.containerIdentifier++,
      maxProductStorage: Math.floor(Math.random() * 100 + products.length),
      maxWeight: Math.floor(Math.random() * 200 + products.reduce((prev, curr) => prev + curr.weight, 0)),
      name: containerName,
      containerInfo: [
        {name: 'Lorum Ipsum', value: 'Dico prmpta dissentiet'},
        {name: 'Lorum Ipsum', value: 'Oratio volumus'},
      ],
      products: products,
    };
  }

}
