import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Device, Property} from '../../model/device';
import {Location} from '../../model/location';
import {DeviceModel, LocationModel, PropertyModel} from '../../model/deviceModel';
import * as faker from 'faker';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  url: string = "http://chariot-km.dai-lab.de:8001";
  // testURL: String = "https://jsonplaceholder.typicode.com/";

  locations: Location[] = [];
  devices : Device[] = [];

  constructor(private http: HttpClient) {
  }

  getDeviceData(): Observable<Object> {
    let header: HttpHeaders = new HttpHeaders();
    header.append("Access-Control-Allow-Origin", "*");
    return this.http.get(this.url + "/devices/?format=json", {headers: header})
  }


  parseDeviceData(data : Array<DeviceModel>): {location: Location[], device: Device[]}  {
    for(let element of data) {
      let newDevice = new Device(
        element.id,
        element.name,
        null,
        Math.floor(Math.random() * 10000) / 100,
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
      );

      let newLocation = this.createLocFromLocModel(element.location);
      newLocation.addDeviceGroup(newDevice);
      this.locations.push(newLocation);

      let properties = [];
      for(let prop of element.properties) {
        let newProperty = this.createPropFromPropModel(prop);
        properties.push(newProperty);
      }
      newDevice.properties = properties;

      this.devices.push(newDevice)
    }

    return {location: this.locations,device: this.devices};
  }

  /**
   * Checks if the location all ready exists other wise returns a new location and returns the location of the device
   * @param loc
   */
  createLocFromLocModel(loc: LocationModel) : Location {
    let foundElement = this.locations.find(s => s.identifier == loc.identifier);
    if(foundElement != undefined)
      return foundElement;

    return new Location(loc.identifier, loc.type, loc.name, loc.position);
  }

  createPropFromPropModel(prop: PropertyModel) : Property {
    let nestedProperty : Property[] = [];

    if(prop.value instanceof Array){
      for(let nestedProp of prop.value){
        let newProp = new Property(nestedProp.timestamp, nestedProp.type, nestedProp.key, nestedProp.value, nestedProp.writable);
        nestedProperty.push(newProp);
      }
    }

    let newProperty = new Property(prop.timestamp, prop.type, prop.key, prop.value instanceof Array ? nestedProperty : prop.value, prop.writable);
    newProperty.unit = prop.unit;

    return newProperty;
  }
}
