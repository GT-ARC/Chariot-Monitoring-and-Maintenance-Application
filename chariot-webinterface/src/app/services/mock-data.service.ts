import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";

import * as faker from 'faker'

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
    for(let i = 0; i < 100; i++){
      this.devices.push({
        idenfitifier: i,
        name: "Device " + i,
        symbole: null,

        power_state: Math.random() >= 0.5,
        power_consumption: Math.floor(Math.random() * 100 * 100)/100,

        running: Math.floor(Math.random() * 200 + 50),
        down_time: Math.floor(Math.random() * 50),
        description: [
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
        issues: [
          {
            state: Math.random() >= 0.2,
            description: "",
            issue_date: faker.date.past().getDate(),
            importance: Math.random() * 10
          },
          {
            state: Math.random() >= 0.2,
            description: "",
            issue_date: Date.now(),
            importance: Math.random() * 10
          },
          {
            state: Math.random() >= 0.2,
            description: "",
            issue_date: Date.now(),
            importance: Math.random() * 10
          },
          {
            state: Math.random() >= 0.2,
            description: "",
            issue_date: Date.now(),
            importance: Math.random() * 10
          },
          {
            state: true,
            description: "",
            issue_date: Date.now(),
            importance: 0
          }
        ],
        timeline: []
      })
    }

    var devIndex = 0;
    for(let i = 0; i < 20; i++){
      let randNumber = Math.floor(Math.random() * 3) + 2;
      let location = {
        identifier: "l" + i,
        type: null,
        name: Math.random() > 0.5 ? "Room " + i : "Space " + i,
        position: null,
        devices: this.devices.slice(devIndex, devIndex + randNumber)
      };
      this.locations.push(location);
      devIndex = devIndex + randNumber;
    }

    var devFloor = 0;
    for(let i = 0; i < 2; i++) {
      let randNumber = Math.floor(Math.random() * 8) + 2;
      let floor: Floor = {
        identifier: "f" + i,
        name: "Floor " + i,
        locations: this.locations.slice(devFloor, devFloor + randNumber)
      };
      this.floor.push(floor);
      devFloor = devFloor + randNumber;
    }
  }

  getFloor(): Observable<{floors: Floor[], locations: Location[], devices: Device[]}> {
    return of({
      floors: this.floor,
      locations: this.locations,
      devices: this.devices});
  }
}
