import {DeviceGroup} from './deviceGroup';

export class Location {

  public identifier: number;
  public type: String;
  public name: String;
  public position: {
    lat: number;
    lng: number;
  };
  public devices: DeviceGroup[];

  constructor(identifier: number, type: String, name: String, position: { lat: number; lng: number }) {
    this.identifier = identifier;
    this.type = type;
    this.name = name;
    this.position = position;
    this.devices = [];
  }

  public addDeviceGroup(deviceGroup: DeviceGroup): void {
    this.devices.push(deviceGroup);
  }
}
