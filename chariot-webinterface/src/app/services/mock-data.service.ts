import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";

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
        power_state: Math.random() >= 0.8,
        power_consumption: Math.random() * 100,

        running: parseInt(' ' + Math.random() * 200 + 50),
        down_time: parseInt(' ' + Math.random() * 100),
        description: [
          {
            title: "Lorem ipsum",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit consectetur eum asperiores, doloribus, facilis assumenda itaque commodi obcaecati esse, blanditiis consequatur reprehenderit. Porro, possimus tempore. Architecto rerum porro aliquid a."
          },
          {
            title: "Dolor",
            desc: "Lorem ipsum dolor"
          },
          {
            title: "Adipisicing",
            desc: "amet consectetur adipisicing elit."
          },
          {
            title: "Architecto",
            desc: "Architecto rerum porro aliquid a."
          }
        ],
        issues: [
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
