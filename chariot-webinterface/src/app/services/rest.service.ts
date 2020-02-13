import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Device, Property} from '../../model/device';
import {Location} from '../../model/location';
import {DeviceModel, LocationModel, PropertyModel} from '../../model/deviceModel';
import * as faker from 'faker';
import {PmNotificationReceiverService} from './pm-notification-receiver.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {


  currentMonitoringService: string = "";
  mappingObserv = new EventEmitter<{deviceID : String, agentID: String} []>();

  locations: Location[] = [];
  devices : Device[] = [];

  constructor(private http: HttpClient) {
  }

  getHistoryData(url: string) : Observable<Object> {
    // console.log("Receive data: " + url);
    return this.http.get(url + "history/");
  }

  getDeviceData(): Observable<Object> {
    let header: HttpHeaders = new HttpHeaders();
    header.append("Access-Control-Allow-Origin", "*");
    return this.http.get(environment.databaseUrl + "/devices/?format=json", {headers: header})
  }

  getServices() {
    let header: HttpHeaders = new HttpHeaders();
    header.append("Access-Control-Allow-Origin", "*");
    return this.http.get(environment.databaseUrl + "/services/", {headers: header})
  }

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
    if(prop.type == "Array") {
      value = nestedProperty;
    } else if(prop.type == "Number") {
      // @ts-ignore
      value = parseFloat(prop.value);
    } else if(prop.type == "boolean") {
      value = prop.value == "on" || prop.value == "true";
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

  getDeviceMapping(): Observable<{deviceID : String, agentID: String}[]> {
    this.http.get(environment.monitoringServiceURL).subscribe(data => {
      if (Array.isArray(data) && data.length != 0) {
        let monitoringService = data[0]['agentlist'];
        this.currentMonitoringService = monitoringService['url'];
        // console.log(this.currentMonitoringService);

        let mapping: {deviceID : String, agentID: String} [] = [];

        let mappings = monitoringService['mappings'];
        for(let element of mappings) {
          mapping.push({
            deviceID : element['device_id'],
            agentID : element['agent_id']
          });
        }

        this.mappingObserv.emit(mapping);
      }
    });
    return this.mappingObserv.asObservable();
  }

}
