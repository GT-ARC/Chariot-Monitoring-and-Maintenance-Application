import { Injectable } from '@angular/core';
import {DeviceModel, LocationModel, PropertyModel} from "../../../model/deviceModel";
import {Location} from "../../../model/location";
import {Device, Property} from "../../../model/device";

@Injectable({
  providedIn: 'root'
})
export class DeviceParseService {

  locations: Location[] = [];
  devices : Device[] = [];

  constructor() { }

  parseDeviceData(data : Array<DeviceModel>): {location: Location[], device: Device[]}  {
    console.log("Parse received data");
    for(let element of data) {
      let newDevice = new Device(
        element.uuid,
        element.name,
        null,
        Math.floor(Math.random() * 10000) / 100,
        Math.floor(Math.random() * 200 + 50),
        Math.floor(Math.random() * 50),
        [
          {
            title: "ID",
            desc: element.id
          },
          {
            title: "objectType",
            desc: element.objectType
          },
          {
            title: "URL",
            desc: element.url
          },
          {
            title: "IP-Address",
            desc: element.ip
          },
          {
            title: "Manufacturer",
            desc: element.manufacturer
          }
        ],
        []
      );

      let location = this.createLocFromLocModel(element.location);
      if(location.devices.find( s => s.constructor == newDevice.constructor && s.identifier == newDevice.identifier) == undefined)
        location.addDevice(newDevice);
      if(this.locations.find(s => s.identifier == element.location.identifier) == undefined)
        this.locations.push(location);

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

    if(prop.value instanceof Array) {
      for(let nestedProp of prop.value) {
        // @ts-ignore
        let newProp = this.createPropFromPropModel(nestedProp);
        nestedProperty.push(newProp);
      }
    }

    let value = undefined;
    if(prop.type.toLowerCase() == "array") {
      value = nestedProperty;
    } else if(prop.type.toLowerCase() == "number") {
      // @ts-ignore
      value = parseFloat(prop.value);
    } else if(prop.type.toLowerCase() == "boolean") {
      if (typeof prop.value === "string") {
        value = prop.value.toLowerCase() == "on" || prop.value.toLowerCase() == "true";
      } else {
        value = prop.value;
      }
    } else {
      value = prop.value;
    }

    let newProperty = new Property(prop.timestamp, prop.type, prop.key, value, prop.writable);
    newProperty.unit = prop.unit;
    newProperty.url = prop.url;
    newProperty.topic = prop.kafka_topic;

    // If min or max value isn't set put default values in place
    newProperty.min_value = prop['min'] ? prop['min'] : 0;
    newProperty.max_value = prop['max'] ? prop['max'] : 100;

    return newProperty;
  }

}
