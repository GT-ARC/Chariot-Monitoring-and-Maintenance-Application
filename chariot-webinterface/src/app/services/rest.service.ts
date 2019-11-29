import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Device, Property} from '../../model/device';
import {Location} from '../../model/location';
import {DeviceModel, LocationModel, PropertyModel} from '../../model/deviceModel';
import * as faker from 'faker';
import {PmNotificationReceiverService} from './pm-notification-receiver.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  monitoringServiceURL: string = "http://chariot-km.dai-lab.de:8001/monitoringservice/";
  currentMonitoringService: string = "";
  mappingObserv = new EventEmitter<{deviceID : String, agentID: String} []>();

  url: string = "http://chariot-km.dai-lab.de:8001";
  // testURL: String = "https://jsonplaceholder.typicode.com/";

  locations: Location[] = [];
  devices : Device[] = [];

  constructor(private http: HttpClient) {
  }

  getHistoryData(url: string) : Observable<Object> {
    if(url.indexOf('?format=json')) {
      url = url.replace('?format=json', 'history/?format=json');
    }
    console.log("Receive data: " + url);
    return this.http.get(url);
  }

  getDeviceData(): Observable<Object> {
    let header: HttpHeaders = new HttpHeaders();
    header.append("Access-Control-Allow-Origin", "*");
    return this.http.get(this.url + "/devices/?format=json", {headers: header})
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
        location.addDeviceGroup(newDevice);
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

    let newProperty = new Property(prop.timestamp, prop.type, prop.key, prop.value instanceof Array ? nestedProperty : prop.value, prop.writable);
    newProperty.unit = prop.unit;
    newProperty.url = prop.url;
    newProperty.topic = prop.kafka_topic;

    // If min or max value isn't set put default values in place
    newProperty.min_value = prop['min'] ? prop['min'] : 0;
    newProperty.max_value = prop['max'] ? prop['max'] : 100;

    return newProperty;
  }

  getDeviceMapping(): Observable<{deviceID : String, agentID: String}[]> {
    this.http.get(this.monitoringServiceURL).subscribe(data => {
      if (Array.isArray(data) && data.length != 0) {
        let monitoringService = data[0]['agentlist'];
        this.currentMonitoringService = monitoringService['url'];
        console.log(this.currentMonitoringService);

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
