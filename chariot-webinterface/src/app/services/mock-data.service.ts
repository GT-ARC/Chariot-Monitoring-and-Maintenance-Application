import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";

import * as faker from 'faker'
import {Issue} from "../../model/issue";
import {IndividualProcess, ProductProcess} from "../../model/productProcess";
import {Container} from "../../model/Container";

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  floor: Floor[] = [];
  locations: Location[] = [];
  devices: Device[] = [];

  processes: ProductProcess[] = [];
  container: Container[] =  [];

  constructor() {
    this.createData();
  }

  createData(): void {
    let issueIdentifier: number = 0;
    for (let i = 0; i < 100; i++) {
      let dataStartTime: number = faker.date.past().valueOf();
      let dataValue: number = Math.random() * 100;
      let device_data: { y: number, x: number }[] = [];
      let device_data_size = Math.round(Math.random() * 30) + 10;
      let predictionSize = Math.round(Math.random() * 5) + 5;
      for (let c = 0; c < device_data_size; c++) {
        device_data.push({y: dataStartTime, x: dataValue});
        dataStartTime = Math.floor(Math.random() * 10 ** 9 + 10 ** 8 + 10 ** 7) + Math.abs(dataStartTime);
        dataValue += (Math.random() * 20 + 5) * (Math.random() * 2 - 1 > 0 ? 1 : -1);
      }

      let issueDates = [];
      for (let c = 0, date = Math.floor(Date.now() / 86400000) * 86400000; c < 30; c++, date -= 86400000) {
        issueDates.push(date);
      }

      let issues: Issue[] = [];
      for (let c = 0; c < 5; c++) {
        let selectedDate = issueDates[Math.floor(Math.random() * issueDates.length)];
        issues.push({
          identifier: issueIdentifier++,
          // state: selectedDate == Math.floor(Date.now() / 86400000) * 86400000 ? Math.random() >= 0.2 : Math.random() >= 0,
          state: selectedDate == Math.floor(Date.now() / 86400000) * 86400000 ? Math.random() >= 0.5 : Math.random() >= 0,
          description: "",
          type: faker.commerce.productName().slice(0, 15),
          issue_date: selectedDate + Math.floor(Math.random() * 86400000),
          importance: Math.floor(Math.random() * 100)
        })
      }

      let newDevice = new Device(
        i,
        "Device " + i,
        null,
        Math.random() >= 0.2,
        Math.floor(Math.random() * 100 * 100) / 100,
        Math.floor(Math.random() * 200 + 50),
        Math.floor(Math.random() * 50),
        [
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          },
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          },
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          },
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          }
        ],
        issues,
        device_data.slice(0, device_data.length - predictionSize),
        device_data.slice(device_data.length - predictionSize - 1, device_data.length)
      );

      let mockDeviceProperties: {
        name: string, value: {
          value: any,
          description?: string,
          unit?: string,
          min_value?: any,
          max_value?: any
        }
      }[] = [
        {
          name: 'Sensitivity',
          value: {
            value: Math.random(),
            unit: '%',
            min_value: 0,
            max_value: 1,
          }
        },
        {
          name: 'Measurement schedule',
          value: {
            value: Math.floor(Math.random() * 100),
            unit: 'sec',
            min_value: 0,
            max_value: 100,
          }
        },
        {
          name: 'Accuracy',
          value: {
            value: Math.random(),
            unit: '°',
            min_value: 0,
            max_value: 1,
          }
        },
        {
          name: 'Security Measurement',
          value: {
            value: Math.random() > 0.5
          }
        },
        {
          name: 'Log',
          value: {
            value: Math.random() > 0.5
          }
        },
        {
          name: 'Name',
          value: {
            value: faker.name.firstName() + " " + faker.name.lastName(),
            description: "First Name + Last Name"
          }
        },
        {
          name: 'Destination',
          value: {
            value: faker.address.streetAddress(true),
            description: "Adress"
          }
        },
      ];
      let deviceProperties: { name: string, value: { value: any } }[] = [];
      let devicePropertyAmount = Math.ceil(Math.random() * 5);
      for (let i = 0; i < devicePropertyAmount; i++) {
        let element = Math.floor(Math.random() * mockDeviceProperties.length);
        let deviceProperty = mockDeviceProperties.splice(element, 1).pop();
        deviceProperty['type'] = typeof (deviceProperty.value.value);
        deviceProperties.push(deviceProperty)
      }

      newDevice.properties = deviceProperties;

      this.devices.push(newDevice);
    }

    var devIndex = 0;
    for (let i = 0; i < 20; i++) {
      let randNumber = Math.floor(Math.random() * 3) + 2;
      let location = {
        identifier: i,
        type: null,
        name: Math.random() > 0.5 ? "Room " + i : "Space " + i,
        position: null,
        devices: this.devices.slice(devIndex, devIndex + randNumber)
      };
      this.locations.push(location);
      devIndex = devIndex + randNumber;
    }

    var devFloor = 0;
    for (let i = 0; i < 2; i++) {
      let randNumber = Math.floor(Math.random() * 8) + 2;
      let floor: Floor = {
        identifier: "f" + i,
        name: "Floor " + i,
        level: i,
        locations: this.locations.slice(devFloor, devFloor + randNumber)
      };
      this.floor.push(floor);
      devFloor = devFloor + randNumber;
    }

    this.locations = this.floor.map(f => f.locations).reduce((prev, curr) => prev.concat(curr), []);
    this.devices = this.floor.map(f =>
      f.locations.map(l => l.devices).reduce((prev, curr) => prev.concat(curr), [])
    ).reduce((prev, curr) => prev.concat(curr), []);

    let processIdentifier: number = 0;
    for (let i = 0; i < 100; i++) {

      let currentProgress = Math.floor(Math.random() * 7);
      // let currentProgress = 1;

      let randomProperties = [
        {
          name: "Name",
          unit: "",
          value: faker.name.findName(),
          size: 1,
          icon: "perm_identity",
          errorThreshold: -1,
          display: true,
        },
        {
          name: "File Name",
          unit: "",
          value: faker.system.fileName(),
          size: 1,
          icon: "folder",
          errorThreshold: -1,
          display: true,
        },
        {
          name: "Color",
          unit: "",
          value: faker.internet.color(),
          size: 1,
          icon: "color_lens",
          errorThreshold: -1,
          display: true,
        },
        {
          name: "Weight",
          unit: "g",
          value: Math.floor(Math.random() * 10000) / 100,
          size: 1,
          icon: "fitness_center",
          errorThreshold: Math.floor(Math.random() * 5000) / 100,
          display: true,
        },
        {
          name: "Temperature",
          unit: "°C",
          value: Math.floor(Math.random() * 10000) / 100,
          size: 2,
          icon: "waves",
          errorThreshold: Math.floor(Math.random() * 5000) / 100,
          display: true,
        },
        {
          name: "Speed",
          unit: "m/s",
          value: Math.floor(Math.random() * 10000) / 100,
          size: 1,
          icon: "navigate_next",
          errorThreshold: Math.floor(Math.random() * 5000) / 100,
          display: true,
        },
      ];

      let productFlow = [
        {
          name: "Scheduling",
          icon: "schedule",
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
          name: "Printing Product Process",
          icon: "./assets/Icons/process_flow/printer.svg",
          progress: currentProgress == 1 ? Math.floor(Math.random() * 100) :
            currentProgress > 1 ? 100 : -1,
          paused: false,
          total: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 10))),
          running: new Date(Math.floor(24 * 60 * 60 * 1000 / (Math.random() * 20 + 5))),
          properties: [
            {
              name: "Travel Speed",
              unit: "mm/s",
              value: Math.floor(Math.random() * 200),
              size: 1,
              icon: "flash_on",
              errorThreshold: -1,
              display: true,
            },
            {
              name: "Infill Density",
              unit: "mm/s",
              value: Math.floor(Math.random() * 200),
              size: 1,
              icon: "flash_on",
              errorThreshold: -1,
              display: true,
            },
            {
              name: "Fillament usage",
              unit: "mm/s",
              value: Math.floor(Math.random() * 200),
              size: 1,
              icon: "flash_on",
              errorThreshold: -1,
              display: true,
            },
            {
              name: "Extruder Temperature",
              unit: "mm/s",
              value: Math.floor(Math.random() * 200),
              size: 1,
              icon: "flash_on",
              errorThreshold: -1,
              display: true,
            },
            {
              name: "Fillament level",
              value: Math.floor(Math.random() * 100),
              display: false,
            },
            {
              name: "Fillament Diameter",
              unit: "mm/s",
              value: Math.floor(Math.random() * 200),
              size: 1,
              icon: "flash_on",
              errorThreshold: -1,
              display: true,
            },
          ]
        },
        {
          name: "Measurement",
          icon: "./assets/Icons/process_flow/measurement.svg",
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
          name: "Deformation Checking",
          icon: "./assets/Icons/process_flow/deformation_checking.svg",
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
          name: "Packing",
          icon: "./assets/Icons/process_flow/packing.svg",
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
          name: "Robot Carrier",
          icon: "./assets/Icons/process_flow/robot.svg",
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
          name: "Store in Warehouse",
          icon: "./assets/Icons/process_flow/warehouse.svg",
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


      for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
        let remove = Math.floor(Math.random() * productFlow.length);
        if (productFlow[remove].progress > 0 && productFlow[remove].progress < 100)
          continue;
        productFlow.splice(remove, 1);
      }

      let productInfo =
        [
          {
            name: "Material",
            value: faker.commerce.productMaterial()
          },
          {
            name: "Weight",
            value: Math.floor(Math.random() * 100) + " g"
          },
          {
            name: "Color",
            value: faker.commerce.color(),
          },
          {
            name: "Price",
            value: faker.commerce.price(),
          },
          {
            name: "Catch Phrase",
            value: faker.company.catchPhrase()
          },
          {
            name: "Date",
            value: faker.date.future()
          },
          {
            name: "Reg Number",
            value: faker.finance.iban()
          },
          {
            name: "Bitcoin Address",
            value: faker.finance.bitcoinAddress()
          },
          {
            name: "Country",
            value: faker.address.country()
          }
        ];
      for (let i = 0; i < Math.floor(Math.random() * 4 + 2); i++) {
        productInfo.splice(Math.floor(Math.random() * productInfo.length), 1)
      }


      this.processes.push(
        {
          identifier: processIdentifier++,
          status: "Status",
          productName: "Product Name",
          productAddInfo: "Additonal information",
          statusInformation: "Status information",
          energyUsed: Math.floor(Math.random() * 200),
          deliveryDate: faker.date.future(),
          image: Math.random() > 0.5 ? "./assets/Images/product1.png" : "./assets/Images/product2.png",
          state: Math.random() > 0.5,
          productFlow: productFlow,
          productInfo: productInfo
        }
      )
    }

    // Create containers
    for (let i = 0; i < 5; i++) {

      let containerName = faker.commerce.productName();
      if(containerName.length > 15)
        containerName = containerName.slice(0, 15);

      let maxProduct = Math.floor(Math.random() * this.processes.length + 10);

      this.container.push({
        identifier: i,
        maxProductStorage: Math.floor(Math.random() * 100 + 50),
        maxWeight: Math.floor(Math.random() * 200),
        name: containerName,
        containerInfo: [
          {name: "Lorum Ipsum", value: "Dico prmpta dissentiet"},
          {name: "Lorum Ipsum", value: "Oratio volumus"},
        ],
        products: MockDataService.jsonCopy(this.processes)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * (maxProduct-10) + 10))
      })
    }
  }

  static jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  }

  getFloor(): Observable<{ floors: Floor[], locations: Location[], devices: Device[] }> {
    return of({
      floors: this.floor,
      locations: this.locations,
      devices: this.devices
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
}
