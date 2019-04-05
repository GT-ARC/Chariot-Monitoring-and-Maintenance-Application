import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";

import * as faker from 'faker'
import {Issue} from "../../model/issue";

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  floor: Floor[] = [];
  locations: Location[] = [];
  devices: Device[] = [];

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
  }

  getFloor(): Observable<{ floors: Floor[], locations: Location[], devices: Device[] }> {
    return of({
      floors: this.floor,
      locations: this.locations,
      devices: this.devices
    });
  }
}
