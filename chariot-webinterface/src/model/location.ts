import {DeviceGroup} from './deviceGroup';
import {Device} from './device';

export class Location {

  public identifier: string;
  public type: String;
  public name: String;
  public position: {
    lat: number;
    lng: number;
  };
  public devices: (Device | DeviceGroup) [];

  constructor(identifier: string, type: String, name: String, position: { lat: number; lng: number }) {
    this.identifier = identifier;
    this.type = type;
    this.name = name;
    this.position = position;
    this.devices = [];
  }

  public addDeviceGroup(deviceGroup: (Device | DeviceGroup)): void {
    this.devices.push(deviceGroup);
  }
}
