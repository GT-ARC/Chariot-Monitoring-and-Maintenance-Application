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
  public devices: Device [];
  public deviceGroups: DeviceGroup[];

  constructor(identifier: string, type: String, name: String, position: { lat: number; lng: number }) {
    this.identifier = identifier;
    this.type = type;
    this.name = name;
    this.position = position;
    this.devices = [];
    this.deviceGroups = [];
  }

  public addDevice(device: Device) {
    this.devices.push(device);
  }

  public addDeviceGroup(deviceGroup: DeviceGroup): void {
    this.deviceGroups.push(deviceGroup);
  }

  public getDeviceById(id : string) : Device {
    return this.devices.find(device => device.identifier == id);
  }
}
