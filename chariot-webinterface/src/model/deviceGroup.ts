import {Device} from './device';

export class DeviceGroup {

  public readonly identifier : string;
  public devices : Device[];
  public name: string;
  public unfolded: boolean = Math.random() > 0.5;

  constructor(identifier: string, name: string) {
    this.identifier = identifier;
    this.name = name;
    this.devices = [];
  }

  public addDevice(device: Device) {
    this.devices.push(device);
  }
}
